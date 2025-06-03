import { aiService } from './aiService';
import { db } from './database';

class CronService {
    private intervalId: NodeJS.Timeout | null = null;
    private isRunning = false;

    start() {
        if (this.isRunning) {
            console.log('Cron service is already running');
            return;
        }

        this.isRunning = true;
        console.log('Starting cron service...');

        // Run immediately on start
        this.runQuery();

        // Then run every 6 hours (6 * 60 * 60 * 1000 ms)
        this.intervalId = setInterval(
            () => {
                this.runQuery();
            },
            6 * 60 * 60 * 1000,
        );
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('Cron service stopped');
    }

    private async runQuery() {
        console.log('Running scheduled AI query...');

        const settings = db.getAPISettings();
        if (!settings || !settings.apiKey) {
            console.log('No API settings found, skipping scheduled query');
            return;
        }

        try {
            const result = await aiService.queryAI();
            if (result.success) {
                console.log('Scheduled query completed successfully');
            } else {
                console.error('Scheduled query failed:', result.error);
            }
        } catch (error) {
            console.error('Error in scheduled query:', error);
        }
    }

    async runManualQuery(): Promise<{ success: boolean; error?: string }> {
        console.log('Running manual AI query...');

        try {
            const result = await aiService.queryAI();
            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    isServiceRunning(): boolean {
        return this.isRunning;
    }

    getNextRunTime(): Date | null {
        if (!this.isRunning) return null;

        const lastQuery = db.getLastSuccessfulQuery();
        if (!lastQuery) return new Date(); // Run immediately if no previous query

        const nextRun = new Date(lastQuery.timestamp);
        nextRun.setHours(nextRun.getHours() + 6);
        return nextRun;
    }
}

export const cronService = new CronService();
