import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import data from '../../../../transaction-whatsapp-chatbot-884b604d124d.json' with { type: 'json' };
    

class GoogleClient {
    constructor() {
        this.doc = null;
        this.serviceAccountAuth = new JWT({
            email: data.client_email,
            key: data.private_key.replace(/\\n/g, '\n'),
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