import { authpath } from '../utils/path.js';
import { connectionInstance } from '../core/connection.js';
import { mailService } from '../services/mail.service.js';
import { DisconnectReason } from "@whiskeysockets/baileys";
import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode';

const TIMESTAMP_FILE = path.join(process.cwd(), 'auth_info', 'last_qr_sent.txt');
const EMAIL_COOLDOWN = 1000 * 60 * 5

export default async function onConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
        const now = Date.now();
        let lastSent = 0;

        try {
            if (fs.existsSync(TIMESTAMP_FILE)) {
                lastSent = parseInt(fs.readFileSync(TIMESTAMP_FILE, 'utf-8'));
            }
        } catch (error) {
            console.error('Error reading timestamp file:', error);
        }

        const timeDiff = now - lastSent;

        if (timeDiff < EMAIL_COOLDOWN) {
            const minutesLeft = Math.ceil((EMAIL_COOLDOWN - timeDiff) / 60000);
            console.log(`⏳ QR terdeteksi, tapi email di-skip. Cooldown aktif (${minutesLeft} menit lagi).`);
            return;
        }

        try {
            fs.writeFileSync(TIMESTAMP_FILE, now.toString(), 'utf-8');
            console.log('📧 Sending authentication email with QR code...');
            const bufferCode = await generateQRCode(qr);
            if (!bufferCode) return;
            await mailService.sendAuthenticationMail({
                to: "redomeire@gmail.com",
                subject: "Login attempt detected",
                body: `<p>Scan the attached QR code to log in to the WhatsApp Gateway.</p><img src="cid:qrcode@cid" style="width: 300px; height: 300px;"/> <br><p>Or use link below and paste it to qr maker such as <a href="https://goqr.me" target="_blank">goqr.me</a></p>${qr}`,
                qrBuffer: bufferCode
            });
        } catch (error) {
            console.error('❌ Failed to send authentication email:', error);
        }
    }
    if (connection === 'close') {
        const shouldReconnect =
            (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
        if (!shouldReconnect)
            await clearAuthFiles();
        else
            await connectionInstance.connect();
    } else if (connection === 'open') {
        console.log('opened connection')
    }
}

async function generateQRCode(qr) {
    try {
        const dataUrl = await qrcode.toDataURL(qr, {
            scale: 10,
            margin: 2,
            errorCorrectionLevel: 'L',
            type: 'image/png'
        });
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        const bufferCode = Buffer.from(base64Data, 'base64');
        return bufferCode;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
}

async function clearAuthFiles() {
    console.log("You logged out. Deleting auth files...");
    try {
        const files = await fs.promises.readdir(authpath);
        if (files.length > 0) {
            const deletePromises = files.map(file =>
                fs.promises.rm(path.join(authpath, file), {
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