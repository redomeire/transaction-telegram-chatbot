import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

class GoogleClient {
    constructor() {
        this.doc = null;
        this.serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
            key: process.env.GOOGLE_SHEET_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
    }

    async getDoc() {
        if (this.doc) return this.doc;
        const doc = 
        new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, this.serviceAccountAuth);
        await doc.loadInfo();
        this.doc = doc;
        return this.doc;
    }
}

export const googleClient = new GoogleClient();