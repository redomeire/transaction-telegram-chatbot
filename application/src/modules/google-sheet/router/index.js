import express from 'express';
import { GoogleSheetService } from '../service/google-sheet.service.js';
import { GoogleSheetController } from '../controller/google-sheet.controller.js';
import { AIAgentService } from '../../ai-agent/service/ai-agent.service.js';

const googleSheetService = new GoogleSheetService();
const aiAgentService = new AIAgentService();
const googleSheetController = new GoogleSheetController(googleSheetService, aiAgentService);

const router = express.Router();
router.post('/create', googleSheetController.createNewRow)

export { router as googleSheetRouter };