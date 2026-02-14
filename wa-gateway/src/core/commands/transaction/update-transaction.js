import { updateTransaction } from "../../action/transaction/update-transaction.js";

class UpdateTransactionCommand {
    constructor() {
        this.name = 'update_transaction';
        this.description = 'Update transaction';
        this.points = 2;
    }

    async execute(bot, m, ...args) {
        const firstArrayElement = args[0];
        const id = firstArrayElement[0];
        const restOfWords = args.join(' ').replace(id, '').trim();
        await updateTransaction({
            id,
            text: restOfWords,
            bot,
            m
        })
    }
}

export default UpdateTransactionCommand;