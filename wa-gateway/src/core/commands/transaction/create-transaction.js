import { createTransaction } from "../../action/transaction/create-transaction.js";

class CreateTransactionCommand {
    constructor() {
        this.name = 'create_transaction';
        this.description = 'Create a new transaction';
        this.points = 2;
    }

    async execute(bot, m, ...args) {
        const restOfWords = args.join(' ');
        await createTransaction({
            text: restOfWords,
            bot,
            m
        })
    }
}

export default CreateTransactionCommand;