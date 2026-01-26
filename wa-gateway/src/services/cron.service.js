import cron from 'node-cron';

export class CronService {
    constructor() {
        this.crons = new Map();
    }

    addCron({ name, time, taskFn }) {
        const newCron = cron.schedule(time, taskFn, {
            name
        })
        this.crons.set(newCron.name, newCron);
    }

    updateCron({ name, time, taskFn }) {
        const existingCron = this.crons.get(name);
        if (existingCron) {
            existingCron.stop();
            this.crons.delete(name);
        }
        const updatedCron = cron.schedule(time, taskFn, {
            name
        });
        this.crons.set(updatedCron.name, updatedCron);
    }

    startCron(name) {
        const cronJob = this.crons.get(name);
        if (!cronJob) return;
        cronJob.start();
    }

    stopCron(name) {
        const cronJob = this.crons.get(name);
        if (!cronJob) return;
        cronJob.stop();
    }

    removeCron(name) {
        const cronJob = this.crons.get(name);
        if (!cronJob) return;
        cronJob.stop();
        this.crons.delete(name);
    }
}

export const cronService = new CronService();