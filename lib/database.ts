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
    model?: string;
    prompt: string;
    lastUsed: Date;
}

interface AIModel {
    id: string;
    name: string;
    description?: string;
    pricing?: {
        prompt: number;
        completion: number;
    };
    context_length?: number;
    free?: boolean;
}

interface QueryLog {
    id?: number;
    timestamp: Date;
    provider: string;
    prompt: string;
    response: string;
    success: boolean;
    error?: string;
    responseTime?: number;
    searchQuery?: string;
    resultsCount?: number;
}

interface SearchHistory {
    id?: number;
    timestamp: Date;
    query: string;
    filters: any;
    resultsCount: number;
    provider: string;
}

class DatabaseManager {
    private isClient = typeof window !== 'undefined';

    getCompanies(): ITCompany[] {
        if (!this.isClient) return [];
        try {
            const data = localStorage.getItem('companies');
            const companies = data ? JSON.parse(data) : [];
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
            const companiesWithTimestamp = companies.map((company) => ({
                ...company,
                lastUpdated: new Date(),
            }));
            localStorage.setItem('companies', JSON.stringify(companiesWithTimestamp));
        } catch (error) {
            console.error('Error saving companies:', error);
        }
    }

    hasCompanyData(): boolean {
        return this.getCompanies().length > 0;
    }

    getAPISettings(): APISettings | null {
        if (!this.isClient) return null;
        try {
            const data = localStorage.getItem('apiSettings');
            const settings = data ? JSON.parse(data) : null;
            return settings ? { ...settings, lastUsed: new Date(settings.lastUsed) } : null;
        } catch (error) {
            console.error('Error getting API settings:', error);
            return null;
        }
    }

    saveAPISettings(settings: Omit<APISettings, 'id' | 'lastUsed'>) {
        if (!this.isClient) return;
        try {
            const settingsWithTimestamp = { ...settings, lastUsed: new Date() };
            localStorage.setItem('apiSettings', JSON.stringify(settingsWithTimestamp));
        } catch (error) {
            console.error('Error saving API settings:', error);
        }
    }

    addQueryLog(log: Omit<QueryLog, 'id'>) {
        if (!this.isClient) return;
        try {
            const logs = this.getQueryLogs();
            const newLog = { ...log, id: Date.now(), timestamp: new Date() };
            logs.unshift(newLog);
            localStorage.setItem('queryLogs', JSON.stringify(logs.slice(0, 100)));
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

    addSearchHistory(search: Omit<SearchHistory, 'id'>) {
        if (!this.isClient) return;
        try {
            const history = this.getSearchHistory();
            const newSearch = { ...search, id: Date.now(), timestamp: new Date() };
            history.unshift(newSearch);
            localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 50)));
        } catch (error) {
            console.error('Error adding search history:', error);
        }
    }

    getSearchHistory(limit: number = 20): SearchHistory[] {
        if (!this.isClient) return [];
        try {
            const data = localStorage.getItem('searchHistory');
            const history = data ? JSON.parse(data) : [];
            return history.slice(0, limit).map((search: any) => ({
                ...search,
                timestamp: new Date(search.timestamp),
            }));
        } catch (error) {
            console.error('Error getting search history:', error);
            return [];
        }
    }

    getLastSuccessfulQuery(): QueryLog | null {
        const logs = this.getQueryLogs(50);
        return logs.find((log) => log.success) || null;
    }

    clearAllData() {
        if (!this.isClient) return;
        localStorage.removeItem('companies');
        localStorage.removeItem('apiSettings');
        localStorage.removeItem('queryLogs');
        localStorage.removeItem('searchHistory');
    }

    getSearchAnalytics() {
        const logs = this.getQueryLogs(100);
        const history = this.getSearchHistory(50);

        return {
            totalSearches: history.length,
            totalQueries: logs.length,
            successRate:
                logs.length > 0 ? (logs.filter((l) => l.success).length / logs.length) * 100 : 0,
            averageResponseTime:
                logs.length > 0
                    ? logs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / logs.length
                    : 0,
            topSearchTerms: this.getTopSearchTerms(history),
            queryTrends: this.getQueryTrends(logs),
            providerUsage: this.getProviderUsage(logs),
        };
    }

    private getTopSearchTerms(history: SearchHistory[]) {
        const termCounts = history.reduce(
            (acc, search) => {
                const terms = search.query
                    .toLowerCase()
                    .split(' ')
                    .filter((term) => term.length > 2);
                terms.forEach((term) => {
                    acc[term] = (acc[term] || 0) + 1;
                });
                return acc;
            },
            {} as Record<string, number>,
        );

        return Object.entries(termCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([term, count]) => ({ term, count }));
    }

    private getQueryTrends(logs: QueryLog[]) {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map((date) => {
            const count = logs.filter(
                (log) => log.timestamp.toISOString().split('T')[0] === date,
            ).length;
            return { date, count };
        });
    }

    private getProviderUsage(logs: QueryLog[]) {
        const providerCounts = logs.reduce(
            (acc, log) => {
                acc[log.provider] = (acc[log.provider] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        return Object.entries(providerCounts)
            .map(([provider, count]) => ({ provider, count }))
            .sort((a, b) => b.count - a.count);
    }
}

export const db = new DatabaseManager();
export type { ITCompany, APISettings, QueryLog, AIModel, SearchHistory };
