import "dotenv/config";
import { JwtPayload, verify } from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export default class TokenManager {
  static VerifyAccessToken(token: string): string | JwtPayload {
    return verify(token, JWT_SECRET);
  }
}
