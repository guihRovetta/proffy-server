import nodemailer from 'nodemailer';

interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export default class MailProvider {
  async sendMail(message: EmailMessage) {
    const { from, to, subject, text, html } = message;

    try {
      let testAccount = await nodemailer.createTestAccount();

      let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      let info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });

      return `${nodemailer.getTestMessageUrl(info)}`;
    } catch {
      throw new Error('Unable to send e-mail');
    }
  }
}
