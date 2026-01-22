import { GoogleGenAI } from '@google/genai';

class AgentClient {
    constructor() {
        this.client = new GoogleGenAI({ apiKey: process.env.AGENT_API_KEY });
    }
}

export const agentClient = new AgentClient();