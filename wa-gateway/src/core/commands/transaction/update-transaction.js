import { stateService } from "../../../services/state.service.js";
import { updateTransaction } from "../../action/transaction/update-transaction.js";

class UpdateTransactionCommand {
    constructor() {
        this.name = 'update_transaction';
        this.description = 'Update transaction';
        this.points = 2;
    }

    async execute(bot, m, ...args) {
        stateService.setState(m.chat.id, {
            cmd: this.name,
            step: 'WAIT_TRANSACTION_UPDATE_DETAILS'
        })
        await bot.sendMessage(m.chat.id, "😊 Kasih tau aku ID transaksi yang mau diupdate beserta detail barunya!", {
            parse_mode: 'Markdown',
            reply_markup: {
                force_reply: true,
                selective: true
            }
        });
    }

    async onReply(bot, m) {
        const chatId = m.chat.id;
        const id = m.text.split(' ')[0];
        const text = m.text.split(' ').slice(1).join(' ');
        await updateTransaction({
            id,
            text,
            bot,
            m
        })
        stateService.clearState(chatId);
    }
}

export default UpdateTransactionCommand;