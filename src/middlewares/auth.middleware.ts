import TokenManager from "src/utils/tokenManager";
import { Request, Response, NextFunction } from "express";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { ResponseManager } from "src/utils/responseManager";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const tokenPayLoad = TokenManager.VerifyAccessToken(token);
      //@ts-ignore
      req.user = tokenPayLoad;
      next();
    } catch (error) {
      throw ResponseManager.AuthenticationFailedResponse();
    }
  }
}
