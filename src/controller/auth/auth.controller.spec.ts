import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ClientKafka } from '@nestjs/microservices';
import { HttpException } from '../../strategy/http-exception.strategy';
import { of } from 'rxjs';

describe('AuthController', () => {
    let controller: AuthController;
    let clientKafkaMock: ClientKafka;
    let httpExceptionMock: HttpException;

    beforeEach(async () => {
        clientKafkaMock = {
            send: jest.fn(),
            subscribeToResponseOf: jest.fn(),
            connect: jest.fn(),
        } as any;

        httpExceptionMock = {
            responseHelper: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: 'CONSUMER-API', useValue: clientKafkaMock },
                { provide: HttpException, useValue: httpExceptionMock },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        const mockRes = {};

        it('deve realizar login com sucesso', async () => {
            const body = { email: 'user@test.com', password: '123456' };
            const kafkaResponse = { success: true, token: 'jwt-token' };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(kafkaResponse));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(kafkaResponse);

            const result = await controller.login(body, mockRes);

            expect(clientKafkaMock.send).toHaveBeenCalledWith('auth_login', body);
            expect(result).toEqual(kafkaResponse);
        });

        it('deve retornar erro se credenciais estiverem incorretas', async () => {
            const body = { email: 'user@test.com', password: 'errado' };
            const kafkaErrorResponse = { success: false, message: 'Credenciais inválidas' };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(kafkaErrorResponse));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(kafkaErrorResponse);

            const result = await controller.login(body, mockRes);

            expect(result).toEqual(kafkaErrorResponse);
        });
    });

    describe('store', () => {
        const mockRes = {};

        it('deve registrar um novo usuário com sucesso', async () => {
            const body = { name: 'Ana', email: 'ana@teste.com', password: '123456' };
            const kafkaResponse = { success: true, data: { id: '1', ...body } };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(kafkaResponse));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(kafkaResponse);

            const result = await controller.store(body, mockRes);

            expect(clientKafkaMock.send).toHaveBeenCalledWith('auth_store', body);
            expect(result).toEqual(kafkaResponse);
        });

        it('deve retornar erro se o e-mail já estiver em uso', async () => {
            const body = { name: 'Ana', email: 'ana@teste.com', password: '123456' };
            const kafkaErrorResponse = { success: false, message: 'E-mail já cadastrado' };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(kafkaErrorResponse));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(kafkaErrorResponse);

            const result = await controller.store(body, mockRes);

            expect(result).toEqual(kafkaErrorResponse);
        });
    });
});