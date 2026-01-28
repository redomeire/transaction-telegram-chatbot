import { fetcher } from "../../../utils/api.js";
import { rupiahFormatter } from "../../../utils/rupiahformatter.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const createTransaction = async ({
    text,
    sock,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/google-sheet/create`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
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
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '✅',
                    key: m.key
                }
            })
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\n✅ Transaksi Berhasil Disimpan!\n\n🆔 ID: *${data.data.ID}*\n📅 Tanggal: ${data.data.Tanggal}\n💰 Nominal: ${rupiahFormatter(data.data.Harga)}\n📝 Judul: ${data.data.Judul}\n\n_Ketik !update [id] [nilai_baru] untuk mengubah._`
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
                text: `🤖[Bot Transaction] \n\nGagal menyimpan transaksi. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { createTransaction };