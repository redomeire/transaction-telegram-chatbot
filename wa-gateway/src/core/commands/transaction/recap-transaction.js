import { recapTransaction } from "../../action/transaction/recap-transaction.js";

class RecapTransactionCommand {
    constructor() {
        this.name = 'recap';
        this.description = 'Recap today transaction';
        this.points = 1;
    }

    async execute(sock, m, ...args) {
        await recapTransaction({ sock, m });
    }
}

export default RecapTransactionCommand;