import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from '../service/app.service';

describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const mockAppService = {
      sendMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar appService.sendMessage e retornar status', async () => {
    const mockData = { foo: 'bar' };
    const sendMessageSpy = jest.spyOn(appService, 'sendMessage').mockResolvedValue(undefined);

    const result = await controller.enviar(mockData);

    expect(sendMessageSpy).toHaveBeenCalledWith('meu-topico-kafka', mockData);
    expect(result).toEqual({ status: 'Mensagem enviada para Kafka' });
  });
});