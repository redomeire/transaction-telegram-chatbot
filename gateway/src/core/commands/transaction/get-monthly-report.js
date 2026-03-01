import { getMonthlyReport } from "../../action/transaction/get-monthly-report.js";

class GetMonthlyReportCommand {
    constructor() {
        this.name = 'get_monthly_report';
        this.description = 'Get the monthly transaction report';
        this.points = 3;
    }

    async execute(bot, m, args) {
        await getMonthlyReport({
            telegramId: m.from.id,
            bot,
            m
        })
    }
}

export default GetMonthlyReportCommand;