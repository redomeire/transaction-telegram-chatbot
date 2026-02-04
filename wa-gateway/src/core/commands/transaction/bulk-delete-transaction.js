import { bulkDeleteTransaction } from "../../action/transaction/bulk-delete-transaction.js";

class DeleteTransactionCommand {
    constructor() {
        this.name = 'bulk-delete';
        this.description = 'bulk delete transaction by id';
        this.points = 4;
    }

    async execute(sock, m, args) {
        const ids = args;
        if (!ids) return sock.sendMessage(m.key.remoteJid, { text: "⚠️ Berikan ID!" });
        await bulkDeleteTransaction({
            ids,
            sock,
            m
        })
    }
}

export default DeleteTransactionCommand;