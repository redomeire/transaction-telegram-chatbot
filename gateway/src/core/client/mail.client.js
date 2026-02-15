import nodemailer from 'nodemailer';

const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;
const username = process.env.MAIL_USERNAME;
const password = process.env.MAIL_PASSWORD;
const from = process.env.MAIL_FROM;

class MailClient {
    constructor() {
        this.mailClient = nodemailer.createTransport({
            host,
            port,
            secure: true,
            auth: {
                user: username,
                pass: password,
            },
        });
    }
    
    async sendMail({ to, subject, body, ...rest }) {
        const email = await this.mailClient.sendMail({
            from,
            to,
            subject,
            html: body,
            ...rest
        });
        return email;
    }
}

export const mailClient = new MailClient();
