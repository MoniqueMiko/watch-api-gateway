import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class AppService implements OnModuleInit {
  private kafkaProducer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'api-gateway',
      brokers: ['localhost:9092'],
    });

    const producer = kafka.producer();
    await producer.connect();

    this.kafkaProducer = producer;
  }

  async sendMessage(topic: string, message: any) {
    await this.kafkaProducer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}