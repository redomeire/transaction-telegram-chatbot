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
            res.status(500).json({ error: true, error: error.message });
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
            res.status(500).json({ error: true, error: error.message });
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
            res.status(500).json({ error: true, error: error.message });
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
            res.status(500).json({ error: true, error: error.message });
        }
    }
}