import { fetcher } from "../../utils/api.js";

const baseUrl = process.env.VERCEL_API_URL;

const updateTransaction = async ({
    id,
    text,
    sock,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/google-sheet/update/${id}`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
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
                text: `✅ *Transaksi Berhasil Diupdate!*\n🆔 ID: *${data.data.ID}*\n📅 Tanggal: ${data.data.Tanggal}\n💰 Nominal: Rp ${data.data.Harga}\n📝 Judul: ${data.data.Judul}`
            })
        },
        onError: async () => {
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '❌',
                    key: m.key
                }
            })
        }
    })
    return response;
}

export { updateTransaction };