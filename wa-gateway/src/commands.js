import { createTransaction, deleteTransaction, updateTransaction,  } from './transaction.js';

const commands = {
    "halo": "🤖 [Bot Assistant]: Halo juga! Ada yang bisa saya bantu?",
    "info": "🤖 [Bot Assistant]: Saya adalah bot yang berjalan di akun ini.",
    "help": "🤖 [Bot Assistant]: Berikut adalah daftar perintah yang tersedia:\n- !halo: Menyapa bot.\n- !info: Informasi tentang bot.\n- !help: Menampilkan daftar perintah. \n- !create: Membuat transaksi baru \n !update: Mengubah transaksi \n !delete: Menghapus transaksi",
}

const transactionsCommands = {
    "create": createTransaction,
    "update": updateTransaction,
    "delete": deleteTransaction,
}

export { commands, transactionsCommands };