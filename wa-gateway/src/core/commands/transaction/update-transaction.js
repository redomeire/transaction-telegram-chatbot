import { updateTransaction } from "../../action/transaction/update-transaction.js";

class UpdateTransactionCommand {
    constructor() {
        this.name = 'update';
        this.description = 'Update transaction';
    }

    async execute(sock, m, ...args) {
        const firstArrayElement = args[0];
        const id = firstArrayElement[0];
        const restOfWords = args.join(' ').replace(id, '').trim();
        await updateTransaction({
            id,
            text: restOfWords,
            sock,
            m
        })
    }
}

export default UpdateTransactionCommand;