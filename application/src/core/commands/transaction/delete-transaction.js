import { deleteTransaction } from "../../action/transaction/delete-transaction.js";

export const DELETE_TRANSACTION_COMMAND = {
    name: 'transaction_delete',
    description: 'delete transaction by id',
    points: 2,
    execute: (services) => async (message) => {
        
    }
}