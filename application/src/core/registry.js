import { BULK_DELETE_TRANSACTION_ACTION } from "./action/transaction/bulk-delete-transaction.js";
import { CREATE_TRANSACTION_ACTION } from "./action/transaction/create-transaction.js";
import { DELETE_TRANSACTION_ACTION } from "./action/transaction/delete-transaction.js";
import { GET_LATEST_TRANSACTION_ACTION } from "./action/transaction/get-latest-transaction.js";
import { RECAP_TRANSACTION_ACTION } from "./action/transaction/recap-transaction.js";
import { UPDATE_TRANSACTION_ACTION } from "./action/transaction/update-transaction.js";
import { HELP_COMMAND } from "./commands/general/help.js";
import { BULK_DELETE_TRANSACTION_COMMAND } from "./commands/transaction/bulk-delete-transaction.js";
import { CREATE_TRANSACTION_COMMAND } from "./commands/transaction/create-transaction.js";
import { DELETE_TRANSACTION_COMMAND } from "./commands/transaction/delete-transaction.js";
import { GET_LATEST_TRANSACTION_COMMAND } from "./commands/transaction/get-latest-transaction.js";
import { RECAP_TRANSACTION_COMMAND } from "./commands/transaction/recap-transaction.js";
import { UPDATE_TRANSACTION_COMMAND } from "./commands/transaction/update-transaction.js";

const commands = [
    {
        command: HELP_COMMAND,
        action: {
            
        }
    },
    {
        command: BULK_DELETE_TRANSACTION_COMMAND,
        action: BULK_DELETE_TRANSACTION_ACTION
    },
    {
        command: CREATE_TRANSACTION_COMMAND,
        action: CREATE_TRANSACTION_ACTION
    },
    {
        command: DELETE_TRANSACTION_COMMAND,
        action: DELETE_TRANSACTION_ACTION
    },
    {
        command: GET_LATEST_TRANSACTION_COMMAND,
        action: GET_LATEST_TRANSACTION_ACTION
    },
    {
        command: RECAP_TRANSACTION_COMMAND,
        action: RECAP_TRANSACTION_ACTION
    },
    {
        command: UPDATE_TRANSACTION_COMMAND,
        action: UPDATE_TRANSACTION_ACTION
    }
]

export const registry = {
    commands: new Map(commands.map(({ command, action }) => [command.name, {
        command, action
    }])),
}