import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { EthService } from './eth.service';
import { Response } from '../../models';

export class GreetDto {
    greet: string;
}

@Controller('eth')
export class EthController {

    private logger = new Logger('EthController');

    constructor(private ethService: EthService) { }

    @Get('info')
    async info(): Promise<Response> {
        try {
            const data = await this.ethService.getInfo();
            return Promise.resolve({
                success: true,
                data
            })

        } catch (error) {
            this.logger.error(error.message, error.stack);
            return Promise.reject({
                success: false,
                error: error.message
            })
        }

    }

    @Get('greet')
    async getGreet(): Promise<Response> {
        try {
            this.logger.log('Getting greet message');
            const data = await this.ethService.getGreet();
            return Promise.resolve({
                success: true,
                message: '',
                data
            })

        } catch (error) {
            this.logger.error(error.message, error.stack);
            return Promise.reject({
                success: false,
                error: error.message
            })
        }

    }

    @Post('greet')
    async setGreet(
        @Body() body: { greet: string }
    ): Promise<Response> {

        try {

            this.logger.log('Setting greet message');
            this.logger.log(body);

            const result = await this.ethService.setGreet(body.greet);

            if (result) {
                return Promise.resolve({
                    success: result,
                    message: 'Greet message set'
                });
            } else {
                throw result;
            }

        } catch (error) {
            this.logger.error(error.message, error.stack);
            return Promise.reject({
                success: false,
                error: error.message
            })
        }

    }

    @Get('verify-proof')
    async verifyProof() {
        try {
            this.logger.log('Verify Proof');
            const verifyProof = await this.ethService.verifyProof();
            return Promise.resolve({
                success: true,
                verifyProof
            })

        } catch (error) {
            this.logger.error(error.message, error.stack);
            return Promise.reject({
                success: false,
                error: error.message
            })
        }

    }

}
