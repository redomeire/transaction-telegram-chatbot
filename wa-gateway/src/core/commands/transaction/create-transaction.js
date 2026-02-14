import { stateService } from "../../../services/state.service.js";
import { createTransaction } from "../../action/transaction/create-transaction.js";

class CreateTransactionCommand {
    constructor() {
        this.name = 'create_transaction';
        this.description = 'Create a new transaction';
        this.points = 2;
    }

    async execute(bot, m, ...args) {
        stateService.setState(m.chat.id, {
            cmd: this.name,
            step: 'WAIT_TRANSACTION_DETAILS'
        })
        await bot.sendMessage(m.chat.id, "😊 Transaksi apa hari ini? Jelasin biar aku paham", {
            parse_mode: 'Markdown',
            reply_markup: {
                force_reply: true,
                selective: true
            }
        });
    }

    async onReply(bot, m) {
        const chatId = m.chat.id;
        const text = m.text;
        await createTransaction({
            text,
            bot,
            m
        })
        stateService.clearState(chatId);
    }
}

export default CreateTransactionCommand;