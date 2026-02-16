import { recapTransaction } from "../../action/transaction/recap-transaction.js";

class RecapTransactionCommand {
    constructor() {
        this.name = 'recap_transaction';
        this.description = 'Recap today transaction';
        this.points = 1;
    }

    async execute(bot, m, ...args) {
        await recapTransaction({ bot, m, telegramId: m.from.id });
    }
}

export default RecapTransactionCommand;