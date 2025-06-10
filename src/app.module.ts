import { AppService } from './service/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './controller/auth/auth.controller';
import { HttpException } from './strategy/http-exception.strategy';
import { ReviewController } from './controller/review/review.controller';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './config/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'CONSUMER-API',
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
  controllers: [AuthController, ReviewController],
  providers: [AppService, HttpException, JwtStrategy],
})
export class AppModule { }