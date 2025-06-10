import { HttpException } from './http-exception.strategy';
import { HttpStatus } from '@nestjs/common';

describe('HttpException', () => {
  let service: HttpException;
  let mockRes;

  beforeEach(() => {
    service = new HttpException();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  const testCases = [
    { status: HttpStatus.BAD_REQUEST, expectedStatus: 400 },
    { status: HttpStatus.UNAUTHORIZED, expectedStatus: 401 },
    { status: HttpStatus.OK, expectedStatus: 200 },
    { status: HttpStatus.CREATED, expectedStatus: 201 },
    { status: HttpStatus.NOT_FOUND, expectedStatus: 404 },
    { status: 999, expectedStatus: 500 }, // status inesperado
  ];

  testCases.forEach(({ status, expectedStatus }) => {
    it(`deve retornar status ${expectedStatus} corretamente`, async () => {
      const response = {
        status: Promise.resolve(status),
        message: { text: 'teste' },
      };

      await service.responseHelper(response, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(expectedStatus);
      expect(mockRes.json).toHaveBeenCalledWith(response.message);
    });
  });
});