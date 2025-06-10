import { Controller, Post, Body, Inject, OnModuleInit, Res, Get, Delete, UseGuards, Param, Put, } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { HttpException } from '../../strategy/http-exception.strategy';
import { JwtGuard } from '../../config/jwt-guard.guard';

@Controller('review')
export class ReviewController implements OnModuleInit {
    constructor(
        @Inject('CONSUMER-API') private readonly client: ClientKafka,
        private _httException: HttpException,
    ) { }

    async onModuleInit() {
        this.client.subscribeToResponseOf('review_store');
        this.client.subscribeToResponseOf('review_index');
        this.client.subscribeToResponseOf('review_update');
        this.client.subscribeToResponseOf('review_show');
        this.client.subscribeToResponseOf('review_delete');

        await this.client.connect();
    }

    @Post('store')
    @UseGuards(JwtGuard)
    async store(@Body() body, @Res() res) {
        const response = await lastValueFrom(this.client.send('review_store', body));
        return await this._httException.responseHelper(response, res);
    }

    //Esta rota em especifico é usada com e sem login
    @Post('index')
    async index(@Res() res) {
        const response = await lastValueFrom(this.client.send('review_index', {}));

        return await this._httException.responseHelper(response, res);
    }

    @Get('show/:id')
    @UseGuards(JwtGuard)
    async show(@Param('id') id, @Res() res) {
        const response = await lastValueFrom(this.client.send('review_show', { id }));

        return await this._httException.responseHelper(response, res);
    }

    @Put('update/:id')
    @UseGuards(JwtGuard)
    async update(@Body() body, @Param('id') id, @Res() res) {
        const response = await lastValueFrom(this.client.send('review_update', { id, body }));

        return await this._httException.responseHelper(response, res);
    }

    @Delete('delete/:id')
    @UseGuards(JwtGuard)
    async delete(@Param('id') id, @Res() res) {
        const response = await lastValueFrom(this.client.send('review_delete', { id }));

        return await this._httException.responseHelper(response, res);
    }
}
