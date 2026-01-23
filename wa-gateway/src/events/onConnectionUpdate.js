import { authpath } from '../utils/path.js';
import { connectionInstance } from '../core/connection.js';
import { DisconnectReason } from "@whiskeysockets/baileys";
import fs from 'fs/promises';
import qrcode from 'qrcode';
import path from 'path';
import { mailService } from '../services/mail.service.js';

let lastEmailSent = 0;
const EMAIL_COOLDOWN = 1000 * 60 * 5

export default async function onConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
        const now = Date.now();
        if (now - lastEmailSent < EMAIL_COOLDOWN) {
            console.log('QR RECEIVED : ', qr);
            console.log('Skipping QR email, still in cooldown period.');
            return;
        }
        const dataUrl = await qrcode.toDataURL(qr, {
            scale: 10,
            margin: 2,
            errorCorrectionLevel: 'L',
            type: 'image/png'
        });
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        const bufferCode = Buffer.from(base64Data, 'base64');
        if (!bufferCode) return;
        await mailService.sendAuthenticationMail({
            to: "redomeire@gmail.com",
            subject: "Login attempt detected",
            body: `<p>Scan the attached QR code to log in to the WhatsApp Gateway.</p><img src="cid:qrcode@cid" style="width: 300px; height: 300px;"/> <br><p>Or use link below and paste it to qr maker such as <a href="https://goqr.me" target="_blank">goqr.me</a></p>${qr}`,
            qrBuffer: bufferCode
        })
    }
    if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
        if (!shouldReconnect) {
            console.log("You logged out. Deleting auth files...");
            try {
                const files = await fs.readdir(authpath);
                if (files.length > 0) {
                    const deletePromises = files.map(file => 
                        fs.rm(path.join(authpath, file), {
                            recursive: true,
                            force: true
                        })
                    )
                    await Promise.all(deletePromises);
                    console.log(`✅ Berhasil menghapus file sesi.`);
                }
            } catch (error) {
                console.error("Gagal menghapus file sesi:", error);
            } finally {
                process.exit(1);
            }
        }
        else await connectionInstance.connect();
    } else if (connection === 'open') {
        console.log('opened connection')
    }
}