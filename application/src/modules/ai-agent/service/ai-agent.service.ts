import { InsertReminder } from "@/db/schema.js";
import { agentClient } from "../client/agent-client.js";
export class AIAgentService {
  agentClient: typeof agentClient;
  constructor() {
    this.agentClient = agentClient;
    this.analyzePromptCreate = this.analyzePromptCreate.bind(this);
  }

  async analyzePromptCreate({
    text,
    categories,
  }: {
    text: string;
    categories?: {
      id: number;
      name: string;
    }[];
  }) {
    const categoriesString = categories
      ? `Kategori yang tersedia: ${JSON.stringify(
          categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
          })),
        )}.`
      : "Tidak ada kategori yang tersedia.";
    const prompt = `
            Anda adalah asisten pencatat keuangan.
            Berikut adalah kategori yang tersedia: ${categoriesString}
            Berikan juga tanggal hari ini dalam format dd-mm-yyyy.
            Ekstrak data berikut dari teks: "title" (judul transaksi), "amount" (angka saja), "type" ('income' atau 'expense'), dan "notes" (keterangan transaksi bisa ada atau tidak).
            Jika kategori transaksi baru, buatlah kategori baru. Jika tidak, gunakan id kategori yang sudah ada.
            Format JSON yang dikembalikan: {"title": string, "amount": number, "type": string, "notes": string, "categoryId": number}.
            Teks: "${text}"
        `;

    const data = await this.createCompletion({ prompt });

    return {
      title: data.title || "-",
      amount: Number(data.amount) || 0,
      type: data.type || "expense",
      notes: data.notes || "",
      categoryId: data.categoryId || null,
    };
  }

  async analyzePromptUpdate({
    text,
    previousData,
  }: {
    text: string;
    previousData: Record<string, any>;
  }) {
    const prompt = `
            Anda adalah asisten pencatat keuangan.
            Berikan tanggal hari ini dalam format dd-mm-yyyy.
            Berikut adalah data transaksi sebelumnya: ${JSON.stringify(previousData)}.
            Ekstrak data berikut dari teks: "title" (judul transaksi), "amount" (angka saja), "type" ('income' atau 'expense'), dan "notes" (keterangan transaksi bisa ada atau tidak).
            Format JSON yang dikembalikan: {"title": string, "amount": number, "type": string, "notes": string, "categoryId": number}.
            Teks baru: "${text}"
        `;

    const data = await this.createCompletion({ prompt });

    return {
      title: data.title || previousData.title || "-",
      amount: Number(data.amount) || previousData.amount || 0,
      type: data.type || previousData.type || "expense",
      notes: data.notes || previousData.notes || "",
      categoryId: data.categoryId || previousData.categoryId || null,
    };
  }

  async analyzePromptReminder({
    text,
    previousData,
  }: {
    text: string;
    previousData?: Partial<InsertReminder>;
  }) {
    const updateString = previousData
      ? `Berikut adalah data pengingat sebelumnya: ${JSON.stringify(previousData)}.`
      : "";
    const prompt = `
            Anda adalah asisten pembuat cron job.
            ${updateString}
            Ekstrak data berikut dari teks: "title", "time" (string pengingat dalam format *), dan "message".
            asterisk pertama adalah detik (0-59), asterisk kedua adalah menit (0-59), asterisk ketiga adalah jam (0-23), asterisk keempat adalah hari dalam bulan (1-31), asterisk kelima adalah bulan (1-12), asterisk keenam adalah hari dalam minggu (0-7) dengan 0 atau 7 adalah Minggu.
            Format JSON yang dikembalikan: {"title": string, "time": string, "message": string}.
            Teks: "${text}"
        `;

    const data = await this.createCompletion({ prompt });

    return {
      id: data.id,
      title: data.title || "-",
      time: data.time || "",
      message: data.message || "",
    };
  }

  async createCompletion({ prompt }: { prompt: string }) {
    const result = await this.agentClient.client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });
    const rawContent = result.choices[0].message.content;
    const jsonString = rawContent?.replace(/```json|```/g, "").trim();
    const data = JSON.parse(jsonString ?? "{}");
    return data;
  }
}
export const aiAgentService = new AIAgentService();
