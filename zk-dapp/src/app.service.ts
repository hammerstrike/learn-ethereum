import { Injectable } from '@nestjs/common';
import { Response } from './models'
import { delay } from './utils';

@Injectable()
export class AppService {

  async getHello(): Promise<Response> {
    await delay(3000);
    return Promise.resolve({
      message: 'Application running',
      success: true
    })
  }
}
