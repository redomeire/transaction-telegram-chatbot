import { OpenAI } from 'openai';

class AgentClient {
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.AGENT_API_KEY,
            baseURL: process.env.AGENT_API_BASE_URL
        })
    }
}

export const agentClient = new AgentClient();