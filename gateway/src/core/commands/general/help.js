export default class HelpCommand {
    constructor() {
        this.name = 'help';
        this.description = 'Displays help information about available commands.';
    }

    async execute(bot, m) {
        const chatId = m.chat.id;
        const message = `
  🤖 *TRANSACTION ASSISTANT* 🤖

Halo! Saya siap membantu mencatat keuanganmu. Berikut adalah daftar perintah yang tersedia:

🛠 *PERINTAH DASAR*
• *!help*
  Menampilkan daftar bantuan ini.

📝 *TRANSAKSI*
• *!create [deskripsi] [nominal]*
  _Contoh: !create Nasi Goreng 15000_

• *!get [limit]*
  Melihat transaksi terbaru.
  _Contoh: !get 5_

• *!update [id] [nilai_baru]*
  Update nominal/deskripsi (ID didapat dari !get).
  _Contoh: !update 10 Beli Mobil_

• *!delete [id]*
  Menghapus transaksi secara permanen.
  _Contoh: !delete 10_

• *!bulk-delete [ids]*
  Menghapus banyak transaksi dalam 1 perintah.
  _Contoh: !delete abcde defgh asdasc_

• *!recap*
  Melihat rekapitulasi transaksi hari ini.
  _Contoh: !recap_

⏱️ *PENGINGAT*
• *!reminder-init*
  Menginisialisasi sistem pengingat.

• *!reminder-create [deskripsi]*
  Membuat pengingat baru.
  _Contoh: !reminder-create Bayar Listrik setiap jam 8 malam_

• *!reminder-get [jumlah]*
  Melihat pengingat yang ada.
  _Contoh: !reminder-get 3_

• *!reminder-delete [id]*
  Menghapus pengingat (ID didapat dari !reminder-get).
  _Contoh: !reminder-delete 2_

━━━━━━━━━━━━━━
💡 *Tips:* Gunakan ID yang tertera pada pesan sukses atau hasil *!get* untuk melakukan update/delete.
`.trim();
        await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
}