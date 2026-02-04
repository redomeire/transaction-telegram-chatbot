import express from 'express';
import { GoogleSheetController } from '../controller/google-sheet.controller.js';
import { googleSheetService } from '../service/google-sheet.service.js';
import { aiAgentService } from '../../ai-agent/service/ai-agent.service.js';
import { cacheService } from '../../cache/service/cache.service.js';

const googleSheetController = new GoogleSheetController(
    googleSheetService, aiAgentService, cacheService
);

const router = express.Router();
router.post('/create', googleSheetController.createNewRow)
router.get('/read', googleSheetController.getLatestRows);
router.put('/update/:id', googleSheetController.updateRow);
router.delete('/delete/bulk', googleSheetController.bulkDeleteRows);
router.delete('/delete/:id', googleSheetController.deleteRow);
router.get('/recap', googleSheetController.getTodayTransactions);

export { router as googleSheetRouter };