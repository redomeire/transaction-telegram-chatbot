import { dateformatter } from "../../../utils/dateformatter.js";

export class GoogleSheetController {
    constructor(googleSheetService, aiAgentService, cacheService) {
        this.googleSheetService = googleSheetService;
        this.aiAgentService = aiAgentService;
        this.cacheService = cacheService;

        this.createNewRow = this.createNewRow.bind(this);
        this.updateRow = this.updateRow.bind(this);
        this.getLatestRows = this.getLatestRows.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.bulkDeleteRows = this.bulkDeleteRows.bind(this);
        this.getTodayTransactions = this.getTodayTransactions.bind(this);
    }

    async createNewRow(req, res) {
        try {
            const { text } = req.body;
            const promptResult = await this.aiAgentService.analyzePromptCreate({ text });
            const result = await this.googleSheetService.addNewRow(promptResult);
            res.status(201).json({
                error: false,
                message: 'Row added successfully',
                data: {
                    ...result,
                    Tanggal: dateformatter(result.Timestamp)
                }
            });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    async getLatestRows(req, res) {
        try {
            const { limit } = req.query;
            if (isNaN(limit) && limit > 10) {
                return res.status(400).json({
                    error: true,
                    message: 'Limit must be a number and not greater than 10'
                });
            }
            const result = await this.cacheService.handleArrayOfObjects(
                `transaction-${this.googleSheetService.getSheetName()}`,
                this.googleSheetService.getLatestRows.bind(this.googleSheetService),
                limit
            )
            res.status(200).json({
                error: false,
                message: 'Latest rows fetched successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    async updateRow(req, res) {
        try {
            const { id } = req.params;
            const { text } = req.body;

            const previousData = await this.googleSheetService.getRowById({ id });
            const promptResult = await this.aiAgentService.analyzePromptUpdate({ text, previousData });
            const { tanggal, judul, harga, kategori } = promptResult;
            const result = await this.googleSheetService.updateRow({ id, tanggal, judul, harga, kategori });
            res.status(200).json({
                error: false,
                message: 'Row updated successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    async deleteRow(req, res) {
        try {
            const { id } = req.params;
            const result = await this.googleSheetService.deleteRow({ id });
            res.status(200).json({
                error: false,
                message: 'Row deleted successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    async bulkDeleteRows(req, res) {
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids) || !ids) {
                return res.status(400).json({
                    error: true,
                    message: 'ids must be an array'
                });
            }
            const result = await this.googleSheetService.bulkDeleteRows({ ids });
            res.status(200).json({
                error: false,
                message: 'Rows deleted successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    async getTodayTransactions(_, res) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const results = await this.cacheService.handleArrayOfObjects(
                `today-transactions-${this.googleSheetService.getSheetName()}`,
                this.googleSheetService.getLatestRows.bind(this.googleSheetService, {
                    fromDate: today,
                    toDate: tomorrow,
                })
            )
            if (results.length === 0) {
                return res.status(404).json({
                    error: true,
                    message: 'No transactions found for today',
                });
            }
            res.status(200).json({
                error: false,
                message: 'Today transactions fetched successfully',
                data: results
            });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }
}