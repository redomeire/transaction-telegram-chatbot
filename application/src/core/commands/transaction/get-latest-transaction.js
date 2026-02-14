import { getLatestTransaction } from "../../action/transaction/get-latest-transaction.js";

export const GET_LATEST_TRANSACTION_COMMAND = {
    name: 'transaction_get',
    description: 'Get the latest transactions',
    points: 1,
    execute: (services) => async (message) => {
       
    }
}