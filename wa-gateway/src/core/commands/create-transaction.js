import { createTransaction } from "../action/create-transaction.js";

class CreateTransactionCommand {
    constructor() {
        this.name = 'create';
        this.description = 'Create a new transaction';
    }

    async execute(sock, m, restOfWords, ...args) {
        await createTransaction({
            text: restOfWords,
            sock,
            m
        })
    }
}

export default CreateTransactionCommand;