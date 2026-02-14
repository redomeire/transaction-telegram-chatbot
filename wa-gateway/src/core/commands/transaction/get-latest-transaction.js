import { stateService } from "../../../services/state.service.js";
import { getLatestTransaction } from "../../action/transaction/get-latest-transaction.js";

class GetLatestTransactionCommand {
    constructor() {
        this.name = 'get_latest_transaction';
        this.description = 'Get the latest transactions';
        this.points = 1;
    }

    async execute(bot, m, args) {
        stateService.setState(m.chat.id, {
            cmd: this.name,
            step: 'WAIT_TRANSACTION_LIMIT'
        })
        await bot.sendMessage(m.chat.id, "😊 Mau lihat berapa transaksi terakhir? Batasnya cuma 10", {
            parse_mode: 'Markdown',
            reply_markup: {
                force_reply: true,
                selective: true
            }
        });
    }

    async onReply(bot, m) {
        const chatId = m.chat.id;
        const limit = m.text;
        await getLatestTransaction({
            limit,
            bot,
            m
        })
        stateService.clearState(chatId);
    }
}

export default GetLatestTransactionCommand;