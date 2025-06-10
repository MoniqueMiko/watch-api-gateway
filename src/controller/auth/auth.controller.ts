import { Controller, Post, Body, Inject, OnModuleInit, Res, Get, } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { HttpException } from '../../strategy/http-exception.strategy';

@Controller('auth')
export class AuthController implements OnModuleInit {
    constructor(
        @Inject('CONSUMER-API') private readonly client: ClientKafka,
        private _httException: HttpException,
    ) { }

    async onModuleInit() {
        this.client.subscribeToResponseOf('auth_login');
        this.client.subscribeToResponseOf('auth_store');
        await this.client.connect();
    }

    @Post('login')
    async login(@Body() body, @Res() res) {
        const response = await lastValueFrom(this.client.send('auth_login', body));

        return await this._httException.responseHelper(response, res);
    }

    @Post('store')
    async store(@Body() body, @Res() res) {
        const response = await lastValueFrom(this.client.send('auth_store', body));

        return await this._httException.responseHelper(response, res);
    }
}
