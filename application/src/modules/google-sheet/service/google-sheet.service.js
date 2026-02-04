import { googleClient } from '../client/google-client.js';
import { dateformatter } from '../../../utils/dateformatter.js';

export class GoogleSheetService {
    constructor() {
        this.googleClient = googleClient;
    }

    async getSheet() {
        const doc = await this.googleClient.getDoc();
        let sheet = doc.sheetsByTitle[this.getSheetName()];

        if (sheet === undefined) {
            throw new Error('Sheet not found for the current month and year');
        }
        return sheet;
    }

    async addNewRow({ id, judul, harga, kategori, keterangan }) {
        let sheet = await this.getSheet();
        if (sheet === undefined) {
            sheet = await doc.addSheet({
                title: this.getSheetName(),
                headerValues: ['ID', 'Timestamp', 'Judul', 'Harga', 'Kategori', 'Keterangan']
            });
        }
        const newRow = {
            ID: id,
            Timestamp: new Date().toISOString(),
            Judul: judul,
            Harga: harga,
            Kategori: kategori,
            Keterangan: keterangan
        };
        await sheet.addRow(newRow);
        return newRow;
    }

    async getLatestRows(params) {
        const { offset = 0, limit, fromDate, toDate } = { ...params };
        const sheet = await this.getSheet();
        const rows = await sheet.getRows({ offset, limit });

        const latestRows = rows
            .reverse()
            .filter(row => {
                if (!fromDate || !toDate) return true;
                const rowDate = new Date(row.get('Timestamp') ?? '');
                if (fromDate && toDate) {
                    return rowDate >= fromDate && rowDate <= toDate;
                }
                return false;
            })
            .map(row => ({
                ID: row.get('ID') ?? '',
                Tanggal: dateformatter(row.get('Timestamp') ?? ''),
                Judul: row.get('Judul'),
                Harga: row.get('Harga'),
                Kategori: row.get('Kategori'),
                Keterangan: row.get('Keterangan')
            }));
        return latestRows;
    }

    async updateRow({ id, tanggal, judul, harga, kategori }) {
        const sheet = await this.getSheet();
        const rows = await sheet.getRows();
        const rowToUpdate = rows.find(row => row.get('ID') === id);

        if (!rowToUpdate) {
            throw new Error('Row not found');
        }
        if (judul !== undefined) rowToUpdate.set('Judul', judul);
        if (harga !== undefined) rowToUpdate.set('Harga', harga);
        if (kategori !== undefined) rowToUpdate.set('Kategori', kategori);
        await rowToUpdate.save();
        return {
            ID: id,
            Tanggal: tanggal,
            Judul: judul,
            Harga: harga,
            Kategori: kategori
        };
    }

    async deleteRow({ id }) {
        const sheet = await this.getSheet();
        const rows = await sheet.getRows();
        const rowToDelete = rows.find(row => row.get('ID') === id);

        if (!rowToDelete) {
            throw new Error('Row not found');
        }

        await rowToDelete.delete();
        return { ID: id };
    }

    async bulkDeleteRows({ ids }) {
        const sheet = await this.getSheet();
        const rows = await sheet.getRows();
        const rowsToDelete = rows.filter(row => ids.includes(row.get('ID')));

        if (rowsToDelete.length === 0) {
            throw new Error('No rows found to delete');
        }

        const responseRows = {
            successRows: [],
        }
        for (const row of rowsToDelete) {
            const id = row.get('ID');
            await row.delete();
            responseRows.successRows.push(id);
        }

        return { deletedIDs: responseRows };
    }

    async getRowById({ id }) {
        const sheet = await this.getSheet();
        const rows = await sheet.getRows();
        const row = rows.find(row => row.get('ID') === id);

        if (!row) {
            throw new Error('Row not found');
        }

        return {
            ID: row.get('ID'),
            Tanggal: dateformatter(row.get('Timestamp')),
            Judul: row.get('Judul'),
            Harga: row.get('Harga'),
            Kategori: row.get('Kategori'),
            Keterangan: row.get('Keterangan')
        };
    }

    getSheetName() {
        const date = new Date();
        const options = { month: 'long', year: 'numeric' };
        const sheetName = date.toLocaleString('id-ID', options);
        return sheetName;
    }
}
export const googleSheetService = new GoogleSheetService();