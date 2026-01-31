import { fetcher } from "../../../utils/api.js";
import { rupiahFormatter } from "../../../utils/rupiahformatter.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const recapTransaction = async ({
    sock,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/google-sheet/recap`,
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        onLoading: async () => {
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '⏳',
                    key: m.key
                }
            })
        },
        onSuccess: async (data) => {
            console.log(data);
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '✅',
                    key: m.key
                }
            })
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\nBerikut rekap transaksi anda di hari ini:\n\n${data.data.map((tx, index) => `${index + 1}. *${tx.ID ?? 'undefined'}*\n📅 Tanggal : ${tx.Tanggal ?? ''}\n💰 Nominal: ${rupiahFormatter(tx.Harga)}\n📝 Judul: ${tx.Judul}\n`).join('\n')}`
            })
        },
        onError: async (error) => {
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '❌',
                    key: m.key
                }
            })
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\nGagal mendapatkan transaksi. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { recapTransaction };