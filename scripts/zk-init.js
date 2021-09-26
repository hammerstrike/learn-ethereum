const { initialize } = require('zokrates-js/node');
const fs = require('fs')
const logger = console;

initialize()
    .then((zokratesProvider) => {
        const source = "def main(private field a) -> field: return a * a";

        // compilation
        const artifacts = zokratesProvider.compile(source);

        // computation
        const { witness, output } = zokratesProvider.computeWitness(artifacts, ["2"]);
        fs.writeFileSync('zk/witness', witness, { flag: 'w+' });

        // run setup
        const keypair = zokratesProvider.setup(artifacts.program);
        fs.writeFileSync('zk/keypair.json', JSON.stringify(keypair), { flag: 'w+' });

        // generate proof
        const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);
        fs.writeFileSync('zk/proof.json', JSON.stringify(proof), { flag: 'w+' });

        // export solidity verifier
        const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk, "v1");
        fs.writeFileSync('contracts/verifier.sol', verifier.toString(), { flag: 'w+' });


    });