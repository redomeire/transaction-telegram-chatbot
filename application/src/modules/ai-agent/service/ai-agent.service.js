import { agentClient } from '../client/agent-client.js';
import { nanoid } from 'nanoid';
export class AIAgentService {
    constructor() {
        this.agentClient = agentClient;
        this.analyzePromptCreate = this.analyzePromptCreate.bind(this);
    }

    async analyzePromptCreate({ text }) {
        const prompt = `
            Anda adalah asisten pencatat keuangan.
            Transaksi baru ini diberi id "${nanoid(8)}".
            Berikan juga tanggal hari ini dalam format dd-mm-yyyy.
            Ekstrak data berikut dari teks: "judul" (judul transaksi), "harga" (angka saja), "kategori" (pengeluaran atau pemasukan), dan "keterangan" (keterangan transaksi bisa ada atau tidak).
            Format JSON yang dikembalikan: {"id": string, "tanggal": string, "judul": string, "harga": number, "kategori": string, "keterangan": string}.
            Teks: "${text}"
        `;

        const data = await this.createCompletion({ prompt });

        return {
            id: data.id,
            tanggal: data.tanggal || "",
            judul: data.judul || "-",
            harga: Number(data.harga) || 0,
            kategori: data.kategori || "pengeluaran",
            keterangan: data.keterangan || ""
        };
    }

    async analyzePromptUpdate({ text, previousData }) {
        const prompt = `
            Anda adalah asisten pencatat keuangan.
            Berikan tanggal hari ini dalam format dd-mm-yyyy.
            Berikut adalah data transaksi sebelumnya: ${JSON.stringify(previousData)}.
            Ekstrak data berikut dari teks: "id" (id transaksi yang akan diperbarui), "judul" (judul transaksi), "harga" (angka saja), "kategori" (pengeluaran atau pemasukan), dan "keterangan" (keterangan transaksi bisa ada atau tidak).
            Format JSON baru yang dikembalikan: {"id": string, "tanggal": string, "judul": string, "harga": number, "kategori": string, "keterangan": string}.
            Teks baru: "${text}"
        `;

        const data = await this.createCompletion({ prompt });

        return {
            id: data.id,
            tanggal: data.tanggal || "",
            judul: data.judul || "-",
            harga: Number(data.harga) || 0,
            kategori: data.kategori || "pengeluaran",
            keterangan: data.keterangan || ""
        };
    }

    async createCompletion({ prompt }) {
        const result = await this.agentClient.client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: prompt
                }
            ],
            response_format: {
                type: 'json_object'
            }
        });
        const rawContent = result.choices[0].message.content;
        const jsonString = rawContent.replace(/```json|```/g, "").trim();
        const data = JSON.parse(jsonString);
        return data;
    }
}