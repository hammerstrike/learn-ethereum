import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Response } from './models'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello(): Promise<Response> {
    return await this.appService.getHello();
  }
}
