import { updateTransaction } from "../action/update-transaction.js";

class UpdateTransactionCommand {
    constructor() {
        this.name = 'update';
        this.description = 'Update transaction';
    }

    async execute(sock, m, ...args) {
        const id = args[0];
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