import { Request, Response } from "express";
import { AIAgentService } from "../service/ai-agent.service";

export class AIAgentController {
  aiAgentService: AIAgentService;
  constructor(aiAgentService: AIAgentService) {
    this.aiAgentService = aiAgentService;
    this.analyzePrompt = this.analyzePrompt.bind(this);
  }

  async analyzePrompt(req: Request, res: Response) {
    try {
      const { text } = req.body;
      const result = await this.aiAgentService.analyzePromptCreate({
        text,
      });
      res.status(200).json({
        error: false,
        message: "Prompt analyzed successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
}
