import SendGrid from '@/common/mail/sendgrid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountMailService {
  async sendDepositEmail(email: string, name: string, value: number) {
    try {
      const msg = {
        to: email,
        from: `Suporte DesafioBack <sup-desafioback@gmail.com>`,
        subject: 'Depósito realizado na conta!',
        templateId: process.env.SENDGRID_DEPOSIT_EMAIL,
        dynamicTemplateData: {
          name,
          value,
        },
      };
      await SendGrid.send(msg);
    } catch (error) {
      return error;
    }
  }
}
