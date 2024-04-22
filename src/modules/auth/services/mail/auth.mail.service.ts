import { User } from '@/modules/user/user.entity';
import { Injectable } from '@nestjs/common';
import ApiError from '@/common/error/entities/api-error.entity';
import SendGrid from '@/common/mail/sendgrid';

@Injectable()
export class AuthMailService {
  async sendResetPasswordEmail(user: User, token: string) {
    const link = `${process.env.FRONTEND_URL ?? 'localhost'}/redefinicao-de-senha?token=${token}`;
    try {
      const msg = {
        to: user.email,
        from: `Suporte Projeto desafio-back <suportedesafioback@gmail.com>`,
        subject: 'Redefinir senha',
        templateId: process.env.SENDGRID_RESET_PASSWORD_EMAIL_TEMPLATE_ID,
        dynamicTemplateData: {
          link: link,
          username: user.name,
        },
      };
      await SendGrid.send(msg);
    } catch (error) {
      throw new ApiError(
        'sendgrid-error',
        'Erro ao enviar email para redefinir a senha',
        500,
      );
    }
  }
}
