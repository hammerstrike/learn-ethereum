import { Module } from '@nestjs/common';
import { EthService } from './eth.service';
import { EthController } from './eth.controller';

@Module({
  controllers: [EthController],
  providers: [EthService]
})
export class EthModule { }
