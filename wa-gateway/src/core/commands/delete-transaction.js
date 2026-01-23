import { deleteTransaction } from "../action/delete-transaction.js";

class DeleteTransactionCommand {
    constructor() {
        this.name = 'delete';
        this.description = 'delete transaction by id';
    }

    async execute(sock, m, args) {
        const id = args[0];
        if (!id) return sock.sendMessage(m.key.remoteJid, { text: "⚠️ Berikan ID!" });
        await deleteTransaction({
            id,
            sock,
            m
        })
    }
}

export default DeleteTransactionCommand;