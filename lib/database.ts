interface ITCompany {
    id?: number;
    rank: number;
    name: string;
    location: string;
    specialty: string;
    revenue2023: number;
    revenue2024: number;
    employees: number;
    marketShare: number;
    lastUpdated: Date;
    source?: string;
}

interface APISettings {
    id?: number;
    provider: 'openai' | 'openrouter' | 'deepseek';
    apiKey: string;
    prompt: string;
    lastUsed: Date;
}

interface QueryLog {
    id?: number;
    timestamp: Date;
    provider: string;
    prompt: string;
    response: string;
    success: boolean;
    error?: string;
}

class DatabaseManager {
    private isClient = typeof window !== 'undefined';

    // Company methods
    getCompanies(): ITCompany[] {
        if (!this.isClient) return [];
        try {
            const data = localStorage.getItem('companies');
            const companies = data ? JSON.parse(data) : [];
            console.log('Getting companies from localStorage:', companies.length);
            return companies.map((c: any) => ({
                ...c,
                lastUpdated: new Date(c.lastUpdated),
            }));
        } catch (error) {
            console.error('Error getting companies:', error);
            return [];
        }
    }

    saveCompanies(companies: ITCompany[]) {
        if (!this.isClient) return;
        try {
            console.log('Saving companies to localStorage:', companies.length);
            const companiesWithTimestamp = companies.map((company) => ({
                ...company,
                lastUpdated: new Date(),
            }));
            localStorage.setItem('companies', JSON.stringify(companiesWithTimestamp));
            console.log('Companies saved successfully');
        } catch (error) {
            console.error('Error saving companies:', error);
        }
    }

    hasCompanyData(): boolean {
        const companies = this.getCompanies();
        console.log('Company data count:', companies.length);
        return companies.length > 0;
    }

    // Settings methods
    getAPISettings(): APISettings | null {
        if (!this.isClient) return null;
        try {
            const data = localStorage.getItem('apiSettings');
            const settings = data ? JSON.parse(data) : null;
            console.log('Getting API settings:', settings ? 'found' : 'not found');
            return settings
                ? {
                      ...settings,
                      lastUsed: new Date(settings.lastUsed),
                  }
                : null;
        } catch (error) {
            console.error('Error getting API settings:', error);
            return null;
        }
    }

    saveAPISettings(settings: Omit<APISettings, 'id' | 'lastUsed'>) {
        if (!this.isClient) return;
        try {
            console.log('Saving API settings:', settings.provider);
            const settingsWithTimestamp = {
                ...settings,
                lastUsed: new Date(),
            };
            localStorage.setItem('apiSettings', JSON.stringify(settingsWithTimestamp));
            console.log('API settings saved successfully');
        } catch (error) {
            console.error('Error saving API settings:', error);
        }
    }

    // Query log methods
    addQueryLog(log: Omit<QueryLog, 'id'>) {
        if (!this.isClient) return;
        try {
            console.log('Adding query log:', log.success ? 'success' : 'failed');
            const logs = this.getQueryLogs();
            const newLog = {
                ...log,
                id: Date.now(),
                timestamp: new Date(),
            };
            logs.unshift(newLog);
            // Keep only last 50 logs
            const trimmedLogs = logs.slice(0, 50);
            localStorage.setItem('queryLogs', JSON.stringify(trimmedLogs));
        } catch (error) {
            console.error('Error adding query log:', error);
        }
    }

    getQueryLogs(limit: number = 10): QueryLog[] {
        if (!this.isClient) return [];
        try {
            const data = localStorage.getItem('queryLogs');
            const logs = data ? JSON.parse(data) : [];
            return logs.slice(0, limit).map((log: any) => ({
                ...log,
                timestamp: new Date(log.timestamp),
            }));
        } catch (error) {
            console.error('Error getting query logs:', error);
            return [];
        }
    }

    getLastSuccessfulQuery(): QueryLog | null {
        const logs = this.getQueryLogs(50);
        return logs.find((log) => log.success) || null;
    }

    // Debug method
    clearAllData() {
        if (!this.isClient) return;
        localStorage.removeItem('companies');
        localStorage.removeItem('apiSettings');
        localStorage.removeItem('queryLogs');
        console.log('All data cleared');
    }
}

export const db = new DatabaseManager();
export type { ITCompany, APISettings, QueryLog };
