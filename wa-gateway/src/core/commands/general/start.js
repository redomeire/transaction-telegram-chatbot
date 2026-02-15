import { stateService } from "../../../services/state.service.js";
import { createUser } from "../../action/user/create-user.js";
import { getUser } from "../../action/user/get-user.js";

export default class StartCommand {
  constructor() {
    this.name = 'start';
    this.description = 'Initiate start command and welcome the user.';
  }

  async execute(bot, m) {
    const chatId = m.chat.id;
    const checkUserResult = await getUser({
      telegramId: m.from.id,
      bot,
      m
    })
    stateService.setState(chatId, {
      cmd: this.name,
      step: 'WAIT_USERNAME',
      telegramId: m.from.id,
      isUserExist: !!checkUserResult
    })
  }

  async onReply(bot, m) {
    const chatId = m.chat.id;
    const username = m.text;
    const state = stateService.getState(chatId);
    const telegramId = state.telegramId;

    if (state.isUserExist) {
      stateService.clearState(chatId);
      return;
    }
    const message = `Selamat datang di *TRANSACTION ASSISTANT* 🤖! Saya siap membantu mencatat keuanganmu. Mohon beritahu username anda`;
    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        force_reply: true,
        selective: true
      }
    });

    await createUser({
      bot,
      m,
      telegramId,
      username
    })
    stateService.clearState(chatId);
  }
}