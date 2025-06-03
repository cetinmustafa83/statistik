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
=======
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
=======

interface QueryLog {
=======
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
=======
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
=======

interface QueryLog {
=======
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
=======

interface QueryLog {
=======
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
=======
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
=======

interface QueryLog {
=======
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
=======
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
=======

interface QueryLog {
=======
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
=======
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
=======

interface QueryLog {
=======
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
=======

interface QueryLog {
=======
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
=======
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
=======

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
            console.log('Saving API settings:', settings.provider, settings.model);
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
            // Keep only last 100 logs
            const trimmedLogs = logs.slice(0, 100);
            localStorage.setItem('queryLogs', JSON.stringify(trimmedLogs));
        } catch (error) {
            console.error('Error adding query log:', error);
        }
    }

    // Search history methods
    addSearchHistory(search: Omit<SearchHistory, 'id'>) {
        if (!this.isClient) return;
        try {
            const history = this.getSearchHistory();
            const newSearch = {
                ...search,
                id: Date.now(),
                timestamp: new Date(),
            };
            history.unshift(newSearch);
            // Keep only last 50 searches
            const trimmedHistory = history.slice(0, 50);
            localStorage.setItem('searchHistory', JSON.stringify(trimmedHistory));
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
        localStorage.removeItem('searchHistory');
        console.log('All data cleared');
    }

    // Analytics methods
    getSearchAnalytics() {
        const logs = this.getQueryLogs(100);
        const history = this.getSearchHistory(50);
        
        return {
            totalSearches: history.length,
            totalQueries: logs.length,
            successRate: logs.length > 0 ? (logs.filter(l => l.success).length / logs.length) * 100 : 0,
            averageResponseTime: logs.length > 0 ? logs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / logs.length : 0,
            topSearchTerms: this.getTopSearchTerms(history),
            queryTrends: this.getQueryTrends(logs),
            providerUsage: this.getProviderUsage(logs)
        };
    }

    private getTopSearchTerms(history: SearchHistory[]) {
        const termCounts = history.reduce((acc, search) => {
            const terms = search.query.toLowerCase().split(' ').filter(term => term.length > 2);
            terms.forEach(term => {
                acc[term] = (acc[term] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(termCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([term, count]) => ({ term, count }));
    }

    private getQueryTrends(logs: QueryLog[]) {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const count = logs.filter(log => 
                log.timestamp.toISOString().split('T')[0] === date
            ).length;
            return { date, count };
        });
    }

    private getProviderUsage(logs: QueryLog[]) {
        const providerCounts = logs.reduce((acc, log) => {
            acc[log.provider] = (acc[log.provider] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(providerCounts)
            .map(([provider, count]) => ({ provider, count }))
            .sort((a, b) => b.count - a.count);
    }
}

export const db = new DatabaseManager();
export type { ITCompany, APISettings, QueryLog, AIModel, SearchHistory };
