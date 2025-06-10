import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from '../service/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('enviar')
  async enviar(@Body() data: any) {
    await this.appService.sendMessage('meu-topico-kafka', data);
    return { status: 'Mensagem enviada para Kafka' };
  }
}