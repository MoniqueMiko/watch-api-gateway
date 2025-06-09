import { HttpStatus } from '@nestjs/common';

export class HttpException {
  async responseHelper(response, res) {
    if ((await response.status) == HttpStatus.BAD_REQUEST) {
      return res.status(HttpStatus.BAD_REQUEST).json(response.message);
    }

    if ((await response.status) == HttpStatus.UNAUTHORIZED) {
      return res.status(HttpStatus.UNAUTHORIZED).json(response.message);
    }

    if ((await response.status) == HttpStatus.OK) {
      return res.status(HttpStatus.OK).json(response.message);
    }

    if ((await response.status) == HttpStatus.CREATED) {
      return res.status(HttpStatus.CREATED).json(response.message);
    }

    return await res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(response.message);
  }
}
