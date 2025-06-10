import { HttpStatus } from '@nestjs/common';

export class HttpException {
  async responseHelper(response, res) {
    const status = await response.status;
    const message = response.message;

    const validStatus = [
      HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
      HttpStatus.OK,
      HttpStatus.CREATED,
      HttpStatus.NOT_FOUND,
    ];

    if (validStatus.includes(status)) {
      return res.status(status).json(message);
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
  }
}