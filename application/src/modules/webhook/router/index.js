import express from 'express';
import { WebhookController } from '../controller/webhook.controller.js';

const webhookController = new WebhookController();

const router = express.Router();
router.post('/webhook', webhookController.handle);

export { router as webhookRouter };