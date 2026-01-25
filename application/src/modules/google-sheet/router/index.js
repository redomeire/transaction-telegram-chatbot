import express from 'express';
import { GoogleSheetService } from '../service/google-sheet.service.js';
import { GoogleSheetController } from '../controller/google-sheet.controller.js';
import { AIAgentService } from '../../ai-agent/service/ai-agent.service.js';
import { CacheService } from '../../cache/service/cache.service.js';

const googleSheetService = new GoogleSheetService();
const aiAgentService = new AIAgentService();
const cacheService = new CacheService();

const googleSheetController = new GoogleSheetController(
    googleSheetService, aiAgentService, cacheService
);

const router = express.Router();
router.post('/create', googleSheetController.createNewRow)
router.get('/read', googleSheetController.getLatestRows);
router.put('/update/:id', googleSheetController.updateRow);
router.delete('/delete/:id', googleSheetController.deleteRow);

export { router as googleSheetRouter };