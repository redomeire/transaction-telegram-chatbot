import { cronService } from "../../../services/cron.service.js";
import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const initReminder = async ({
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/reminder/read`,
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        onSuccess: async (data) => {
            try {
                const crons = data.data;
                for (const cron of crons) {
                    cronService.addCron({
                        name: `reminder-${cron.id}`,
                        time: cron.waktu,
                        taskFn: async () => {
                            // TODO: send feedback to user when reminder is executed
                        }
                    })
                };
            } catch (error) {
                console.error('Error initializing reminders:', error);
            }
        },
        onError: async (error) => {
            // TODO: implement error handling
        }
    })
    return response;
}

export { initReminder };