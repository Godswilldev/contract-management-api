import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseManager {
  public static StandardResponse<T>(
    status: string,
    code: number,
    message: string,
    data: T,
    meta?: object,
  ): StandardResponse<T> {
    return {
      status,
      code,
      message,
      meta,
      data,
    };
  }

  public static AuthenticationFailedResponse() {
    return new HttpException(
      ResponseManager.StandardResponse("Auth failed", 401, "Auth failed", null, null),
      HttpStatus.UNAUTHORIZED,
    );
  }

  public static InternalServerErrorResponse() {
    return new HttpException(
      ResponseManager.StandardResponse("server Error", 500, "This is our fault", null, null),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  public static BadRequestResponse(message: string, meta?: object) {
    return new HttpException(
      ResponseManager.StandardResponse("Bad request", 400, message, null, meta),
      HttpStatus.BAD_REQUEST,
    );
  }

  static NotFoundResponse(message: string, meta?: object) {
    return new HttpException(
      ResponseManager.StandardResponse("Not found", 404, message, null, meta),
      HttpStatus.NOT_FOUND,
    );
  }
}

export class StandardResponse<T = any> {
  @ApiProperty()
  status: string;

  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  data: T;

  meta?: object;
}
