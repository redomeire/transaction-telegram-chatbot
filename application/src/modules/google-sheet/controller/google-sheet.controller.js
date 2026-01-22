export class GoogleSheetController {
    constructor(googleSheetService, aiAgentService) {
        this.googleSheetService = googleSheetService;
        this.aiAgentService = aiAgentService;
        this.createNewRow = this.createNewRow.bind(this);
    }

    async createNewRow(req, res) {
        try {
            const { text } = req.body;
            const { judul, harga, kategori, keterangan } = await this.aiAgentService.analyzePrompt({ text });
            const result = await this.googleSheetService.addNewRow({
                judul,
                harga,
                kategori,
                keterangan
            });
            res.status(201).json({
                error: false,
                message: 'Row added successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({ error: true, error: error.message });
        }
    }
}