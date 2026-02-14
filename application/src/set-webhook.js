import { botService } from "./modules/bot/service/bot.service.js";

async function setWebhook(url) {
    try {
        console.log('Setting webhook...');

        const result = await botService.client.setWebHook(url);
        console.log('Webhook set result:', result);

        if (result) {
            const info = await botService.client.getWebHookInfo();
            console.log('Current webhook info:', info);
        }
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
}