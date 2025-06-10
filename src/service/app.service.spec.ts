import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Kafka, Producer } from 'kafkajs';

jest.mock('kafkajs');

describe('AppService', () => {
  let service: AppService;
  let mockProducer: Producer;

  beforeEach(async () => {
    mockProducer = {
      connect: jest.fn(),
      send: jest.fn(),
    } as any;

    // Simula Kafka.producer() retornando o mockProducer
    (Kafka as jest.Mock).mockImplementation(() => ({
      producer: () => mockProducer,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('onModuleInit deve conectar o producer', async () => {
    await service.onModuleInit();
    expect(mockProducer.connect).toHaveBeenCalled();
  });

  it('sendMessage deve enviar a mensagem corretamente', async () => {
    await service.onModuleInit(); // inicializa o producer

    const topic = 'meu-topico-kafka';
    const message = { foo: 'bar' };

    await service.sendMessage(topic, message);

    expect(mockProducer.send).toHaveBeenCalledWith({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  });
});