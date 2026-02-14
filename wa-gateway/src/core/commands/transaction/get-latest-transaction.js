import { getLatestTransaction } from "../../action/transaction/get-latest-transaction.js";

class GetLatestTransactionCommand {
    constructor() {
        this.name = 'get_latest_transaction';
        this.description = 'Get the latest transactions';
        this.points = 1;
    }

    async execute(bot, m, args) {
        const limit = parseInt(args[0]) || 5;
        await getLatestTransaction({
            limit,
            bot,
            m
        })
    }
}

export default GetLatestTransactionCommand;