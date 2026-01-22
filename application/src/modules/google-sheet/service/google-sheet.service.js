import { googleClient } from '../client/google-client.js';

export class GoogleSheetService {
    constructor() {
        this.googleClient = googleClient;
    }
    
    async addNewRow({ judul, harga, kategori, keterangan }) {
        const doc = await this.googleClient.getDoc();
        let sheet = doc.sheetsByTitle[this.getSheetName()];

        if (sheet === undefined) {
            sheet = await doc.addSheet({
                title: this.getSheetName(),
                headerValues: ['Timestamp', 'Judul', 'Harga', 'Kategori', 'Keterangan']
            });
        }
        const newRow = {
            Timestamp: new Date().toISOString(),
            Judul: judul,
            Harga: harga,
            Kategori: kategori,
            Keterangan: keterangan
        };
        await sheet.addRow(newRow);
        return newRow;
    }

    getSheetName() {
        const date = new Date();
        const options = { month: 'long', year: 'numeric' };

        const sheetName = date.toLocaleString('id-ID', options);
        return sheetName;
    }
}