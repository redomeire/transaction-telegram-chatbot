import { recapTransaction } from "../../action/transaction/recap-transaction.js";

export const RECAP_TRANSACTION_COMMAND = {
    name: 'transaction_recap',
    description: 'Recap today transaction',
    points: 1,
    execute: (services) => async (message) => {
    }
}