import { createTransaction } from "../../action/create-transaction.js";

class CreateTransactionCommand {
    constructor() {
        this.name = 'create';
        this.description = 'Create a new transaction';
    }

    async execute(sock, m, ...args) {
        const restOfWords = args.join(' ');
        await createTransaction({
            text: restOfWords,
            sock,
            m
        })
    }
}

export default CreateTransactionCommand;