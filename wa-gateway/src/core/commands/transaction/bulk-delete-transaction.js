import { stateService } from "../../../services/state.service.js";
import { bulkDeleteTransaction } from "../../action/transaction/bulk-delete-transaction.js";

class DeleteTransactionCommand {
    constructor() {
        this.name = 'delete_transaction_bulk';
        this.description = 'bulk delete transaction by id';
        this.points = 4;
    }

    async execute(bot, m, args) {
        stateService.setState(m.chat.id, {
            cmd: this.name,
            step: 'WAIT_TRANSACTION_IDS'
        })
        await bot.sendMessage(m.chat.id, "😊 Kasih tau aku ID transaksi yang mau dihapus, bisa lebih dari satu, pisahkan dengan koma!", {
            parse_mode: 'Markdown',
            reply_markup: {
                force_reply: true,
                selective: true
            }
        });
    }

    async onReply(bot, m) {
        const chatId = m.chat.id;
        const ids = m.text.split(',').map(id => id.trim());
        await bulkDeleteTransaction({
            ids,
            bot,
            m
        })
        stateService.clearState(chatId);
    }
}

export default DeleteTransactionCommand;