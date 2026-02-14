import { bulkDeleteTransaction } from "../../action/transaction/bulk-delete-transaction.js";

class DeleteTransactionCommand {
    constructor() {
        this.name = 'delete_transaction_bulk';
        this.description = 'bulk delete transaction by id';
        this.points = 4;
    }

    async execute(bot, m, args) {
        const ids = args;
        if (!ids) return bot.sendMessage(m.chat.id, "⚠️ Berikan ID!");
        await bulkDeleteTransaction({
            ids,
            bot,
            m
        })
    }
}

export default DeleteTransactionCommand;