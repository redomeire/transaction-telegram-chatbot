import { agentClient } from '../client/agent-client.js';

export class AIAgentService {
    constructor() {
        this.agentClient = agentClient;
        this.analyzePrompt = this.analyzePrompt.bind(this);
    }

    async analyzePrompt({ text }) {
        const prompt = `
            Anda adalah asisten pencatat keuangan.
            Ekstrak data berikut dari teks: "judul" (judul transaksi), "harga" (angka saja), "kategori" (pengeluaran atau pemasukan), dan "keterangan" (keterangan transaksi bisa ada atau tidak).
            Format JSON: {"judul": string, "harga": number, "kategori": string, "keterangan": string}.
            Teks: "${text}"
        `;

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

        return {
            judul: data.judul || "-",
            harga: Number(data.harga) || 0,
            kategori: data.kategori || "pengeluaran",
            keterangan: data.keterangan || ""
        };
    }
}