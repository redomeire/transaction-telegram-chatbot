import { authpath } from '../utils/path.js';
import { mailService } from '../services/mail.service.js';
import { DisconnectReason } from "@whiskeysockets/baileys";
import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode';

const TIMESTAMP_FILE = path.join(process.cwd(), 'auth_info', 'last_qr_sent.txt');
const EMAIL_COOLDOWN = 1000 * 60 * 5

export async function onConnectionUpdate(update, client, connectionInstance) {
    const { connection, lastDisconnect, qr } = update;
    const isWhatsApp = connectionInstance.driver.constructor.name === 'WhatsAppDriver';

    if (qr && isWhatsApp) {
        const now = Date.now();
        let lastSent = 0;
        try {
            if (fs.existsSync(TIMESTAMP_FILE)) {
                lastSent = parseInt(fs.readFileSync(TIMESTAMP_FILE, 'utf-8'));
            }
        } catch (e) {
            console.error(e);
        }

        if ((now - lastSent) >= EMAIL_COOLDOWN) {
            try {
                const code = await generatePairingCode(client);
                const bufferCode = await generateQRCode(qr);

                await mailService.sendAuthenticationMail({
                    to: "redomeire@gmail.com",
                    subject: `[${connectionInstance.type}] Login attempt`,
                    body: `<p>Scan QR atau gunakan code: <b>${code}</b></p>`,
                    qrBuffer: bufferCode
                });
                fs.writeFileSync(TIMESTAMP_FILE, now.toString(), 'utf-8');
            } catch (error) {
                console.error('❌ Mail error:', error);
            }
        }
    }
    if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const loggedOut = isWhatsApp && statusCode === DisconnectReason.loggedOut;

        if (loggedOut) {
            await clearAuthFiles();
        } else {
            console.log('🔄 Reconnecting...');
            if (isWhatsApp) process.exit(1);
        }
    } else if (connection === 'open') {
        console.log(`✅ [${connectionInstance.type}] Connection Opened`);
        connectionInstance.emit('ready', client);
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
            console.log(`✅ Successfully deleted auth files.`);
        }
    } catch (error) {
        console.error("Deleting session files failed: ", error);
    } finally {
        process.exit(1);
    }
}

async function generatePairingCode(sock) {
    if (sock.authState.creds.registered) return null;

    try {
        const number = process.env.WA_PHONE_NUMBER.replace(/\D/g, '');
        const code = await sock.requestPairingCode(number);
        return code;
    } catch (err) {
        console.error("Pairing code request failed: ", err);
        return null;
    }
}