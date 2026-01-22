import { GoogleGenAI } from '@google/genai';

class AgentClient {
    constructor() {
        this.client = new GoogleGenAI({ apiKey: "AIzaSyDPB4jjdlbvFU2X1Do1O26rc3Dyosco1pw" });
    }
}

export const agentClient = new AgentClient();