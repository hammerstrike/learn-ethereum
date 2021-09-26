import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

import * as Greeter from '../../artifacts/contracts/Greeter.sol/Greeter.json';
import * as Verifier from '../../artifacts/contracts/verifier.sol/Verifier.json';
import * as Proof from '../../zk/proof.json';


@Injectable()
export class EthService {

    private logger = new Logger('EthService');
    private provider: ethers.providers.JsonRpcProvider;
    
    private greeterContract: ethers.Contract;

    private signerAlice: ethers.providers.JsonRpcSigner
    private signerAliceGreeterContract: ethers.Contract;
    private signerAliceVerifierContract: ethers.Contract;

    private signerBob: ethers.providers.JsonRpcSigner
    private signerBobGreeterContract: ethers.Contract;
    private signerBobVerifierContract: ethers.Contract;

    constructor(
        private configService: ConfigService
    ) {
        const RPC_URL = configService.get('RPC_URL');
        const ALICE_ACCOUNT_ADDRESS = configService.get('ALICE_ACCOUNT_ADDRESS');
        const BOB_ACCOUNT_ADDRESS = configService.get('BOB_ACCOUNT_ADDRESS');
        const GREETER_CONTRACT_ADDRESS = configService.get('GREETER_CONTRACT_ADDRESS');
        const VERIFIER_CONTRACT_ADDRESS = configService.get('VERIFIER_CONTRACT_ADDRESS');

        this.provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        this.greeterContract = new ethers.Contract(GREETER_CONTRACT_ADDRESS, Greeter.abi, this.provider);

        this.signerAlice = this.provider.getSigner(ALICE_ACCOUNT_ADDRESS);
        this.signerAliceGreeterContract = new ethers.Contract(GREETER_CONTRACT_ADDRESS, Greeter.abi, this.signerAlice);
        this.signerAliceVerifierContract = new ethers.Contract(VERIFIER_CONTRACT_ADDRESS, Verifier.abi, this.signerAlice);

        this.signerBob = this.provider.getSigner(BOB_ACCOUNT_ADDRESS);
        this.signerBobGreeterContract = new ethers.Contract(GREETER_CONTRACT_ADDRESS, Greeter.abi, this.signerBob);
        this.signerBobVerifierContract = new ethers.Contract(VERIFIER_CONTRACT_ADDRESS, Verifier.abi, this.signerBob);

    }

    async getInfo(): Promise<{ blockNumber: number, balance: string }> {
        try {
            const blockNumber = await this.provider.getBlockNumber();
            const balance = await this.provider.getBalance(this.configService.get('CONTRACT_ADDRESS'));
            return { blockNumber, balance: ethers.utils.formatEther(balance) };
        } catch (error) {
            Promise.reject(error);
        }

    }

    async getGreet(): Promise<{ greet: string }> {
        try {
            const greet = await this.signerAliceGreeterContract.greet();
            return { greet }
        } catch (error) {
            Promise.reject(error);
        }
    }

    async setGreet(message: string): Promise<boolean> {
        try {
            this.logger.log('Setting greet message');
            const greet = message || '[Default] Hello';
            const transaction = await this.signerAliceGreeterContract.setGreeting(greet)
            await transaction.wait();
            return true
        } catch (error) {
            Promise.reject(error);
        }
    }

    async verifyProof(){
        console.log(Proof);
        return this.signerBobVerifierContract.verifyTx(Proof.proof.a, Proof.proof.b, Proof.proof.c, Proof.inputs);
    }
}
