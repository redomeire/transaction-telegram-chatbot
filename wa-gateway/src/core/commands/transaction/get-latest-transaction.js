import { getLatestTransaction } from "../../action/transaction/get-latest-transaction.js";

class GetLatestTransactionCommand {
    constructor() {
        this.name = 'get';
        this.description = 'Get the latest transactions';
    }

    async execute(sock, m, args) {
        const limit = parseInt(args[0]) || 5;
        await getLatestTransaction({
            limit,
            sock,
            m
        })
    }
}

export default GetLatestTransactionCommand;