import { IsJWT, IsNotEmpty, IsString, Length } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty({
    context: {
      message: `missing-token`,
      userMessage: `Token JWT obrigatório`,
    },
  })
  @IsJWT({
    context: {
      message: `invalid-token`,
      userMessage: `Token JWT inválido`,
    },
  })
  token: string;

  @IsNotEmpty({
    context: {
      message: `missing-password`,
      userMessage: `Senha obrigatória`,
    },
  })
  @IsString({
    context: {
      message: `invalid-password`,
      userMessage: `Senha inválida`,
    },
  })
  @Length(6, 30, {
    context: {
      message: `invalid-password`,
      userMessage: `A senha deve ter entre 6 e 30 caracteres`,
    },
  })
  password: string;

  @IsNotEmpty({
    context: {
      message: `missing-confirm_password`,
      userMessage: `Senha obrigatória`,
    },
  })
  @IsString({
    context: {
      message: `invalid-confirm_password`,
      userMessage: `Senha inválida`,
    },
  })
  @Length(6, 30, {
    context: {
      message: `invalid-confirm_password`,
      userMessage: `A senha deve ter entre 6 e 30 caracteres`,
    },
  })
  confim_password: string;
}
