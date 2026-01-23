import { authpath } from '../utils/path.js';
import { connectionInstance } from '../core/connection.js';
import { DisconnectReason } from "@whiskeysockets/baileys";
import fs from 'fs/promises';
import qrcode from 'qrcode-terminal';
import path from 'path';

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