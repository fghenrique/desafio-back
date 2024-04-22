import { Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";

@Injectable()
export class AuthHelper {
  async generateResetPasswordToken(userEmail: string) {
    const token = jwt.sign({ email: userEmail }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  }
}
