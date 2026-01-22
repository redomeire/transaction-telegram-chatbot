import express from 'express';
import { GoogleSheetService } from '../service/google-sheet.service.js';
import { GoogleSheetController } from '../controller/google-sheet.controller.js';

const googleSheetService = new GoogleSheetService();
const googleSheetController = new GoogleSheetController(googleSheetService);

const router = express.Router();
router.post('/create', googleSheetController.createNewRow)

export { router as googleSheetRouter };