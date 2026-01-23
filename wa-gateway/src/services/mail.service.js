import { mailClient } from "../core/client/mail.client.js";

class MailService {
    constructor() {
        this.mailClient = mailClient;
    }

    async sendAuthenticationMail({ to, subject, body, qrBuffer }) {
        const email = await this.mailClient.sendMail({
            to,
            subject,
            body,
            attachments: [
                {
                    filename: 'qrcode.png',
                    content: qrBuffer,
                    cid: 'qrcode@cid'
                }
            ],
        });

        if (email.response.startsWith('2')) {
            console.log("✅ Authentication email sent successfully to", to);
        }
    }
}

export const mailService = new MailService();