import { registry } from "../../../core/registry.js";
import { services } from "../../../core/services/index.js";

export class WebhookController {
    async handle(req, res) {
        try {
            console.log('Received webhook update:', JSON.stringify(req.body));
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({
                    error: true, message: 'message is required'
                });
            }

            if (message?.text?.startsWith('/')) {
                console.log(`Received command: ${message.text} from chat ${message.chat.id}`);
                const commandName = message.text.split(' ')[0].replace('/', '');
                const command = registry.commands.get(commandName)?.command;
                if (command) {
                    command.execute(services)(message);
                } else {
                    console.log(`No command found for ${commandName}, ignoring message`);
                }
            }

            if (message?.text && !message.text.startsWith('/')) {
                const chatId = message.chat.id;
                const cacheClient = services.cacheService.getClient()

                // userstate saves the action name
                const userState = await cacheClient.get(`state:${chatId}`);

                if (userState) {
                    const action = registry.commands.get(userState)?.action;
                    await action.execute(services)(message);
                    await cacheClient.del(`state:${chatId}`);
                    console.log(`Executed action ${userState} for chat ${chatId} and cleared state`)
                } else {
                    console.log(`No user state found for chat ${chatId}, ignoring message`)
                }
                console.log(`Received message from chat ${chatId} with text: ${message.text} and user state: ${userState || 'none'} `)
            }

            if (callback_query) {
                const callbackData = callback_query.data;
                const action = registry.commands.get(callbackData)?.action;
                if (action) {
                    await action.execute(services)(callback_query);
                }
                await services.botService.client.answerCallbackQuery({
                    callback_query_id: callback_query.id,
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