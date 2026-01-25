import { fetcher } from "../../utils/api.js";

const baseUrl = process.env.VERCEL_API_URL;

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
                text: `✅ *Transaksi Berhasil Disimpan!*\n🆔 ID: *${data.data.ID}*\n📅 Tanggal: ${data.data.Tanggal}\n💰 Nominal: Rp ${data.data.Harga}\n📝 Judul: ${data.data.Judul}\n_Ketik !edit [id] [nilai_baru] untuk mengubah._`
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