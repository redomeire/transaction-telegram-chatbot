import { authpath } from '../utils/path.js';
import { connectionInstance } from '../core/connection.js';
import { DisconnectReason } from "@whiskeysockets/baileys";
import fs from 'fs';
import qrcode from 'qrcode-terminal';

export default async function onConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
        console.log('QR RECEIVED : ', qr);
        console.log('Scan QR Code ini untuk login:');
        qrcode.generate(qr, { small: true });
    }
    if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
        if (lastDisconnect.error?.output?.statusCode === 401) {
            console.log("Session expired. Deleting auth files...");
            fs.rmSync(authpath, { recursive: true, force: true });
            await connectionInstance.disconnect();
        }
        // reconnect if not logged out
        if (shouldReconnect) {
            await connectionInstance.connect();
        }
    } else if (connection === 'open') {
        console.log('opened connection')
    }
}