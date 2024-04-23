import SendGrid from '@/common/mail/sendgrid';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AccountMailService {
  logger = new Logger(AccountMailService.name);
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
      this.logger.error('Error sending deposit email', error);
      return error;
    }
  }

  async sendWithdrawEmail(email: string, name: string, value: number) {
    try {
      const msg = {
        to: email,
        from: `Suporte DesafioBack <sup-desafioback@gmail.com>`,
        subject: 'Saque realizado na conta!',
        templateId: process.env.SENDGRID_WITHDRAW_EMAIL,
        dynamicTemplateData: {
          name,
          value,
        },
      };
      await SendGrid.send(msg);
    } catch (error) {
      this.logger.error('Error sending withdraw email', error);
      return error;
    }
  }
}
