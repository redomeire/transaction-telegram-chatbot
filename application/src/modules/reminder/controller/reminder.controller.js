export class ReminderController {
    constructor(aiAgentService, cacheService) {
        this.aiAgentService = aiAgentService;
        this.cacheService = cacheService;

        this.createReminder = this.createReminder.bind(this);
        this.getReminders = this.getReminders.bind(this);
        this.updateReminder = this.updateReminder.bind(this);
        this.deleteReminder = this.deleteReminder.bind(this);
    }

    async createReminder(req, res) {
        try {
            const { text } = req.body;
            const cacheClient = this.cacheService.getClient();

            const promptResult = await this.aiAgentService.analyzePromptReminder({ text });
            await cacheClient.hSet(`reminders:${promptResult.id}`, promptResult);
            res.status(201).json({
                error: false,
                message: 'Reminder created successfully',
                data: promptResult
            });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    async getReminders(req, res) {
        try {
            const { limit } = req.query;
            const results = [];
            const cacheClient = this.cacheService.getClient();

            for await (const rawKey of cacheClient.scanIterator({
                MATCH: 'reminders:*',
                COUNT: limit || 30
            })) {
                if (Array.isArray(rawKey) && rawKey.length === 0) {
                    continue;
                }
                for (const key of rawKey) {
                    const reminder = await cacheClient.hGetAll(key);
                    results.push(reminder);
                }
            }
            if (results.length === 0)
                return res.status(404).json({ error: true, message: 'No reminders found' });
            res.status(200).json({
                error: false,
                message: 'Reminders fetched successfully',
                data: results
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: true, message: error.message });
        }
    }

    async updateReminder(req, res) {
        try {
            const { id } = req.params;
            const { text } = req.body;
            const promptResult = await this.aiAgentService.analyzePromptReminder({ text });
            const cacheClient = this.cacheService.getClient();
            const isHashExist = await cacheClient.exists(`reminders:${id}`);

            if (!isHashExist) {
                return res.status(404).json({ error: true, message: 'Reminder not found' });
            }

            await cacheClient.hSet(`reminders:${id}`, promptResult);
            
            res.status(200).json({
                error: false,
                message: 'Reminder updated successfully',
                data: promptResult
            });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    async deleteReminder(req, res) {
        try {
            const { id } = req.params;
            const cacheClient = this.cacheService.getClient();
            const isHashExist = await cacheClient.exists(`reminders:${id}`);

            if (!isHashExist) {
                return res.status(404).json({ error: true, message: 'Reminder not found' });
            }

            await cacheClient.del(`reminders:${id}`);
            res.status(200).json({
                error: false,
                message: 'Reminder deleted successfully',
            });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }
}