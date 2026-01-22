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

        const result = await this.agentClient.client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        const cleanText = result.text.replace(/```json|```/g, "").trim();

        return JSON.parse(cleanText);
    }
}