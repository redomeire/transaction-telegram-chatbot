import { registry } from "../../../core/registry";
import { services } from "../../../core/services";

class WebhookController {
    async handle(req, res) {
        try {
            const { update } = req.body;
            if (!update) {
                return res.status(400).json({
                    error: true, message: 'update is required'
                });
            }

            if (update.message?.text?.startsWith('/')) {
                const commandName = update.message.text.split(' ')[0].replace('/', '');
                const command = registry.commands.get(commandName)?.command;
                if (command) {
                    command.execute(services)(update.message);
                }
            }

            if (update.message?.text && !update.message.text.startsWith('/')) {
                const chatId = update.message.chat.id;
                const cacheClient = services.cacheService.getClient()

                // userstate saves the action name
                const userState = await cacheClient.get(`state:${chatId}`);

                if (userState) {
                    const action = registry.commands.get(userState)?.action;
                    await action.execute(services)(update.message);
                    await cacheClient.del(`state:${chatId}`);
                }
            }

            if (update.callback_query) {
                const callbackData = update.callback_query.data;
                const action = registry.commands.get(callbackData)?.action;
                if (action) {
                    await action.execute(services)(update.callback_query);
                }
                await services.botService.client.answerCallbackQuery({
                    callback_query_id: update.callback_query.id,
                })
            }

            return res.status(200).json({
                error: false, message: 'Action executed successfully'
            });
        } catch (error) {
            return res.status(500).json({
                error: true, message: error.message
            });
        }
    }
}