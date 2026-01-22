import express from 'express';
import dotenv from 'dotenv';
import { googleSheetRouter } from './modules/google-sheet/router/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/google-sheet', googleSheetRouter);
app.get('/', (_, res) => { res.send('Hello world') });

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;