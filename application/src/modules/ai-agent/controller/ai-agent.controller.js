export class AIAgentController{
    constructor(aiAgentService) {
        this.aiAgentService = aiAgentService;
        this.analyzePrompt = this.analyzePrompt.bind(this);
        this.getModelList = this.getModelList.bind(this);
    }

    async analyzePrompt(req, res) {
        try {
            const { text } = req.body;
            const result = await this.aiAgentService.analyzePrompt({
                text
            });
            res.status(200).json({
                error: false,
                message: 'Prompt analyzed successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({ error: true, error: error.message });
        }
    }
}