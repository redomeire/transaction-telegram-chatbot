// service for handling temporary state after a user sends a message to the bot, but before the bot responds
class StateService {
    constructor() {
        this.states = new Map();
    }

    setState(chatId, state) {
        this.states.set(chatId, state);
    }

    getState(chatId) {
        return this.states.get(chatId);
    }

    clearState(chatId) {
        this.states.delete(chatId);
    }
}

export const stateService = new StateService();
