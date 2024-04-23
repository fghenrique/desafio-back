import SendGrid from '@/common/mail/sendgrid';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AccountMailService {
  logger = new Logger(AccountMailService.name);
  // here we use any because the data may change based on the mail template
  async sendMail(
    email: string,
    subject: string,
    data: any,
    templateId: string,
  ) {
    try {
      const msg = {
        to: email,
        from: `Suporte DesafioBack <sup-desafioback@gmail.com>`,
        subject,
        templateId,
        dynamicTemplateData: data,
      };
      await SendGrid.send(msg);
    } catch (error) {
      this.logger.error('Error sending email', error);
      return error;
    }
  }
}
