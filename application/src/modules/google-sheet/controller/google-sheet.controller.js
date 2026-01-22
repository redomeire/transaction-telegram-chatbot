export class GoogleSheetController {
    constructor(googleSheetService) {
        this.googleSheetService = googleSheetService;
        this.createNewRow = this.createNewRow.bind(this);
    }

    async createNewRow(req, res) {
        try {
            const { judul, kategori, keterangan } = req.body;
            const result = await this.googleSheetService.addNewRow({
                judul,
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