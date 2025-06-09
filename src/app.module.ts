import { Module } from '@nestjs/common';
import { AppService } from './service/app.service';
import { AppController } from './controller/app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './controller/auth/auth.controller';
import { HttpException } from './strategy/http-exception.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'api-gateway-auth',
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AppService, HttpException],
})
export class AppModule {}
