import SendGrid from '@sendgrid/mail';
import { config } from 'dotenv';

config();
if (process.env.SENDGRID_KEY) SendGrid.setApiKey(process.env.SENDGRID_KEY);

export default SendGrid;
