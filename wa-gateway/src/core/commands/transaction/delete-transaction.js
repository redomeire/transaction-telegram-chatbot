import { deleteTransaction } from "../../action/transaction/delete-transaction.js";

class DeleteTransactionCommand {
    constructor() {
        this.name = 'delete_transaction';
        this.description = 'delete transaction by id';
    }

    async execute(bot, m, args) {
        const id = args[0];
        if (!id) return bot.sendMessage(m.chat.id, "⚠️ Berikan ID!");
        await deleteTransaction({
            id,
            bot,
            m
        })
    }
}

export default DeleteTransactionCommand;