import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ClientKafka } from '@nestjs/microservices';
import { HttpException } from '../../strategy/http-exception.strategy';
import { of } from 'rxjs';

describe('ReviewController', () => {
    let controller: ReviewController;
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
            controllers: [ReviewController],
            providers: [
                { provide: 'CONSUMER-API', useValue: clientKafkaMock },
                { provide: HttpException, useValue: httpExceptionMock },
            ],
        }).compile();

        controller = module.get<ReviewController>(ReviewController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return response from index', async () => {
        const mockResponse = { success: true };
        const mockRes = {};
        (clientKafkaMock.send as jest.Mock).mockReturnValue(of(mockResponse));
        (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(mockResponse);

        const result = await controller.index(mockRes);

        expect(clientKafkaMock.send).toHaveBeenCalledWith('review_index', {});
        expect(httpExceptionMock.responseHelper).toHaveBeenCalledWith(mockResponse, mockRes);
        expect(result).toEqual(mockResponse);
    });

    describe('store', () => {
        const mockRes = {};

        it('deve armazenar uma review com sucesso', async () => {
            const body = { text: 'Top', rating: 5 };
            const kafkaResponse = { success: true, data: { id: '1' } };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(kafkaResponse));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(kafkaResponse);

            const result = await controller.store(body, mockRes);

            expect(result).toEqual(kafkaResponse);
            expect(clientKafkaMock.send).toHaveBeenCalledWith('review_store', body);
        });

        it('deve retornar erro se a validação do Kafka falhar', async () => {
            const body = { text: '', rating: -1 }; // inválido (simulado)
            const kafkaErrorResponse = { success: false, message: 'Avaliação inválida' };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(kafkaErrorResponse));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(kafkaErrorResponse);

            const result = await controller.store(body, mockRes);

            expect(result).toEqual(kafkaErrorResponse);
            expect(clientKafkaMock.send).toHaveBeenCalledWith('review_store', body);
        });
    });

    describe('show', () => {
        const mockRes = {};

        it('deve retornar os dados da review com sucesso', async () => {
            const id = 'rev123';
            const kafkaResponse = { success: true, data: { id, text: 'Excelente', rating: 5 } };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(kafkaResponse));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(kafkaResponse);

            const result = await controller.show(id, mockRes);

            expect(clientKafkaMock.send).toHaveBeenCalledWith('review_show', { id });
            expect(httpExceptionMock.responseHelper).toHaveBeenCalledWith(kafkaResponse, mockRes);
            expect(result).toEqual(kafkaResponse);
        });

        it('deve retornar erro se a review não for encontrada', async () => {
            const id = 'naoExiste123';
            const kafkaErrorResponse = { success: false, message: 'Review não encontrada' };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(kafkaErrorResponse));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(kafkaErrorResponse);

            const result = await controller.show(id, mockRes);

            expect(clientKafkaMock.send).toHaveBeenCalledWith('review_show', { id });
            expect(httpExceptionMock.responseHelper).toHaveBeenCalledWith(kafkaErrorResponse, mockRes);
            expect(result).toEqual(kafkaErrorResponse);
        });
    });

    describe('update', () => {
        const mockRes = {};

        it('deve atualizar uma review com sucesso', async () => {
            const id = 'rev123';
            const body = { text: 'Atualizado!', rating: 4 };
            const response = { success: true, data: { id, ...body } };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(response));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(response);

            const result = await controller.update(body, id, mockRes);

            expect(result).toEqual(response);
            expect(clientKafkaMock.send).toHaveBeenCalledWith('review_update', { id, body });
        });

        it('deve retornar erro ao tentar atualizar review inexistente', async () => {
            const id = 'inexistente';
            const body = { text: '...', rating: 1 };
            const error = { success: false, message: 'Review não encontrada' };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(error));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(error);

            const result = await controller.update(body, id, mockRes);

            expect(result).toEqual(error);
        });
    });

    describe('delete', () => {
        const mockRes = {};

        it('deve deletar uma review com sucesso', async () => {
            const id = 'rev123';
            const response = { success: true };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(response));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(response);

            const result = await controller.delete(id, mockRes);

            expect(result).toEqual(response);
        });

        it('deve retornar erro ao tentar deletar review protegida', async () => {
            const id = 'protegida';
            const error = { success: false, message: 'Não é possível excluir review associada a denúncia' };

            (clientKafkaMock.send as jest.Mock).mockReturnValue(of(error));
            (httpExceptionMock.responseHelper as jest.Mock).mockResolvedValue(error);

            const result = await controller.delete(id, mockRes);

            expect(result).toEqual(error);
        });
    });
})