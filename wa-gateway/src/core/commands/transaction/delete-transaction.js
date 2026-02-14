import { stateService } from "../../../services/state.service.js";
import { deleteTransaction } from "../../action/transaction/delete-transaction.js";

class DeleteTransactionCommand {
    constructor() {
        this.name = 'delete_transaction';
        this.description = 'delete transaction by id';
    }

    async execute(bot, m, args) {
        stateService.setState(m.chat.id, {
            cmd: this.name,
            step: 'WAIT_TRANSACTION_ID'
        })
        await bot.sendMessage(m.chat.id, "😊 Kasih tau aku ID transaksinya!", {
            parse_mode: 'Markdown',
            reply_markup: {
                force_reply: true,
                selective: true
            }
        });
    }

    async onReply(bot, m) {
        const chatId = m.chat.id;
        const id = m.text;
        await deleteTransaction({
            id,
            bot,
            m
        })
        stateService.clearState(chatId);
    }
}

export default DeleteTransactionCommand;