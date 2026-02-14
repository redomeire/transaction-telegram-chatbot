export const CREATE_TRANSACTION_ACTION = {
    execute: (services) => async (message) => {
        const { aiAgentService, botService, googleSheetService } = services;
        const promptResult = await aiAgentService.analyzePromptCreate({
            text: message.text
        })
        const result = await googleSheetService.addNewRow(promptResult);
        await botService.sendMessage(message.chat.id, `Transaction created successfully with details: ${JSON.stringify(result)}`);
        console.log(`Created transaction with details: ${JSON.stringify(result)}`);
    }
}