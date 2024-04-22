import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    context: {
      message: `missing-name`,
      userMessage: `Nome obrigatório`,
    },
  })
  @IsString({
    context: {
      message: `invalid-name`,
      userMessage: `Nome inválido`,
    },
  })
  name: string;

  @IsNotEmpty({
    context: {
      message: `missing-email`,
      userMessage: `Email obrigatório`,
    },
  })
  @IsString({
    context: {
      message: `invalid-email`,
      userMessage: `Email inválido`,
    },
  })
  @IsEmail(
    {},
    {
      context: {
        message: `invalid-email`,
        userMessage: `Email inválido`,
      },
    },
  )
  email: string;

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
}
