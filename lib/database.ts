import Loki from 'lokijs';

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
    source: string;
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
    private db: Loki;
    private companies: Collection<ITCompany>;
    private settings: Collection<APISettings>;
    private queryLogs: Collection<QueryLog>;

    constructor() {
        this.db = new Loki('itdashboard.db', {
            persistenceMethod: 'localStorage',
            autoload: true,
            autoloadCallback: this.initializeCollections.bind(this),
            autosave: true,
            autosaveInterval: 4000,
        });
    }

    private initializeCollections() {
        this.companies = this.db.getCollection('companies') || this.db.addCollection('companies');
        this.settings = this.db.getCollection('settings') || this.db.addCollection('settings');
        this.queryLogs = this.db.getCollection('queryLogs') || this.db.addCollection('queryLogs');
    }

    // Company methods
    getCompanies(): ITCompany[] {
        return this.companies?.find() || [];
    }

    saveCompanies(companies: ITCompany[]) {
        this.companies?.clear();
        companies.forEach((company) => {
            this.companies?.insert({
                ...company,
                lastUpdated: new Date(),
            });
        });
        this.db.saveDatabase();
    }

    hasCompanyData(): boolean {
        return (this.companies?.count() || 0) > 0;
    }

    // Settings methods
    getAPISettings(): APISettings | null {
        const settings = this.settings?.findOne();
        return settings || null;
    }

    saveAPISettings(settings: Omit<APISettings, 'id' | 'lastUsed'>) {
        this.settings?.clear();
        this.settings?.insert({
            ...settings,
            lastUsed: new Date(),
        });
        this.db.saveDatabase();
    }

    // Query log methods
    addQueryLog(log: Omit<QueryLog, 'id'>) {
        this.queryLogs?.insert({
            ...log,
            timestamp: new Date(),
        });
        this.db.saveDatabase();
    }

    getQueryLogs(limit: number = 10): QueryLog[] {
        return this.queryLogs?.chain().simplesort('timestamp', true).limit(limit).data() || [];
    }

    getLastSuccessfulQuery(): QueryLog | null {
        return this.queryLogs?.findOne({ success: true }) || null;
    }
}

export const db = new DatabaseManager();
export type { ITCompany, APISettings, QueryLog };
