import { AIModel, db } from './database';

export class AIService {
    private static instance: AIService;
    private modelsCache: { [provider: string]: { models: AIModel[]; timestamp: number } } = {};
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    private isCacheValid(provider: string): boolean {
        const cached = this.modelsCache[provider];
        if (!cached) return false;
        return Date.now() - cached.timestamp < this.CACHE_DURATION;
    }

    async fetchOpenRouterModels(apiKey: string): Promise<AIModel[]> {
        // Check cache first
        if (this.isCacheValid('openrouter')) {
            console.log('Returning cached OpenRouter models');
            return this.modelsCache['openrouter'].models;
        }

        try {
            console.log('Fetching OpenRouter models from API...');
            const response = await fetch('https://openrouter.ai/api/v1/models', {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'IT Dashboard',
                },
            });

            if (!response.ok) {
                throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Filter for free models and popular ones
            const freeModels = data.data
                .filter((model: any) => {
                    const isFree =
                        model.pricing?.prompt === 0 ||
                        model.pricing?.prompt === '0' ||
                        model.pricing?.prompt === null;

                    // Include popular free models
                    const isPopularFree =
                        model.id.includes(':free') ||
                        model.id.includes('llama') ||
                        model.id.includes('mistral') ||
                        model.id.includes('qwen') ||
                        model.id.includes('phi') ||
                        model.id.includes('gemma');

                    return isFree || isPopularFree;
                })
                .map((model: any) => ({
                    id: model.id,
                    name: this.formatModelName(model.name || model.id),
                    description: model.description || `${model.name} - AI-Modell`,
                    pricing: model.pricing,
                    context_length: model.context_length,
                    free:
                        model.pricing?.prompt === 0 ||
                        model.pricing?.prompt === '0' ||
                        model.id.includes(':free'),
                }))
                .sort((a: AIModel, b: AIModel) => {
                    // Sort free models first, then by name
                    if (a.free && !b.free) return -1;
                    if (!a.free && b.free) return 1;
                    return a.name.localeCompare(b.name);
                });

            // Cache the results
            this.modelsCache['openrouter'] = {
                models: freeModels,
                timestamp: Date.now(),
            };

            console.log(`Fetched ${freeModels.length} free OpenRouter models`);
            return freeModels;
        } catch (error) {
            console.error('Error fetching OpenRouter models:', error);
            // Return default models if API fails
            return this.getDefaultOpenRouterModels();
        }
    }

    private formatModelName(name: string): string {
        // Clean up model names for better display
        return name
            .replace(/^[^/]+\//, '') // Remove provider prefix
            .replace(/-/g, ' ') // Replace dashes with spaces
            .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize words
            .replace(/\s+/g, ' ') // Clean up spaces
            .trim();
    }

    getDefaultOpenRouterModels(): AIModel[] {
        return [
            {
                id: 'meta-llama/llama-3.2-3b-instruct:free',
                name: 'Llama 3.2 3B Instruct',
                description: "Meta's Llama 3.2 3B Modell - Kostenlos verfügbar",
                context_length: 131072,
                free: true,
            },
            {
                id: 'meta-llama/llama-3.2-1b-instruct:free',
                name: 'Llama 3.2 1B Instruct',
                description: "Meta's Llama 3.2 1B Modell - Schnell und kostenlos",
                context_length: 131072,
                free: true,
            },
            {
                id: 'qwen/qwen-2-7b-instruct:free',
                name: 'Qwen 2 7B Instruct',
                description: "Alibaba's Qwen 2 7B Modell - Mehrsprachig und kostenlos",
                context_length: 32768,
                free: true,
            },
            {
                id: 'mistralai/mistral-7b-instruct:free',
                name: 'Mistral 7B Instruct',
                description: "Mistral AI's 7B Modell - Europäisches AI-Modell, kostenlos",
                context_length: 32768,
                free: true,
            },
            {
                id: 'microsoft/phi-3-mini-128k-instruct:free',
                name: 'Phi 3 Mini 128K',
                description: "Microsoft's Phi-3 Mini - Kompakt und effizient, kostenlos",
                context_length: 128000,
                free: true,
            },
            {
                id: 'google/gemma-2-9b-it:free',
                name: 'Gemma 2 9B IT',
                description: "Google's Gemma 2 9B Modell - Optimiert für Instruktionen, kostenlos",
                context_length: 8192,
                free: true,
            },
        ];
    }

    getOpenAIModels(): AIModel[] {
        return [
            {
                id: 'gpt-4o',
                name: 'GPT-4o',
                description: 'Das fortschrittlichste GPT-4 Modell von OpenAI',
                context_length: 128000,
                pricing: { prompt: 5.0, completion: 15.0 },
            },
            {
                id: 'gpt-4o-mini',
                name: 'GPT-4o Mini',
                description: 'Schnelleres und günstigeres GPT-4 Modell',
                context_length: 128000,
                pricing: { prompt: 0.15, completion: 0.6 },
            },
            {
                id: 'gpt-4-turbo',
                name: 'GPT-4 Turbo',
                description: 'Hochleistungs GPT-4 Modell mit großem Kontext',
                context_length: 128000,
                pricing: { prompt: 10.0, completion: 30.0 },
            },
            {
                id: 'gpt-3.5-turbo',
                name: 'GPT-3.5 Turbo',
                description: 'Schnelles und effizientes Modell für die meisten Aufgaben',
                context_length: 16385,
                pricing: { prompt: 0.5, completion: 1.5 },
            },
        ];
    }

    getDeepSeekModels(): AIModel[] {
        return [
            {
                id: 'deepseek-chat',
                name: 'DeepSeek Chat',
                description: "DeepSeek's Haupt-Chat-Modell - Kostengünstig und leistungsstark",
                context_length: 32768,
                pricing: { prompt: 0.14, completion: 0.28 },
            },
            {
                id: 'deepseek-coder',
                name: 'DeepSeek Coder',
                description: 'Spezialisiert für Programmieraufgaben und Code-Analyse',
                context_length: 16384,
                pricing: { prompt: 0.14, completion: 0.28 },
            },
        ];
    }

    async getModelsForProvider(provider: string, apiKey?: string): Promise<AIModel[]> {
        console.log(`Getting models for provider: ${provider}`);

        switch (provider) {
            case 'openai':
                return this.getOpenAIModels();
            case 'deepseek':
                return this.getDeepSeekModels();
            case 'openrouter':
                if (apiKey && apiKey.trim()) {
                    return await this.fetchOpenRouterModels(apiKey);
                } else {
                    return this.getDefaultOpenRouterModels();
                }
            default:
                console.warn(`Unknown provider: ${provider}`);
                return [];
        }
    }

    getCachedModels(provider: string): AIModel[] {
        const cached = this.modelsCache[provider];
        return cached ? cached.models : [];
    }

    // AI Query functionality
    async queryAI(): Promise<{ success: boolean; error?: string }> {
        const settings = db.getAPISettings();
        if (!settings || !settings.apiKey) {
            return {
                success: false,
                error: 'Keine API-Einstellungen gefunden',
            };
        }

        if (!settings.model) {
            return {
                success: false,
                error: 'Kein AI-Modell ausgewählt',
            };
        }

        try {
            let response;

            switch (settings.provider) {
                case 'openai':
                    response = await this.queryOpenAI(
                        settings.apiKey,
                        settings.model,
                        settings.prompt,
                    );
                    break;
                case 'openrouter':
                    response = await this.queryOpenRouter(
                        settings.apiKey,
                        settings.model,
                        settings.prompt,
                    );
                    break;
                case 'deepseek':
                    response = await this.queryDeepSeek(
                        settings.apiKey,
                        settings.model,
                        settings.prompt,
                    );
                    break;
                default:
                    throw new Error(`Unbekannter Provider: ${settings.provider}`);
            }

            // Parse and save the response
            const companies = this.parseAIResponse(response);
            if (companies.length > 0) {
                db.saveCompanies(companies);

                // Log successful query
                db.addQueryLog({
                    provider: settings.provider,
                    prompt: settings.prompt,
                    response: JSON.stringify(companies),
                    success: true,
                });

                return { success: true };
            } else {
                throw new Error('Keine gültigen Unternehmensdaten in der Antwort gefunden');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';

            // Log failed query
            db.addQueryLog({
                provider: settings.provider,
                prompt: settings.prompt,
                response: '',
                success: false,
                error: errorMessage,
            });

            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    private async queryOpenAI(apiKey: string, model: string, prompt: string): Promise<string> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content:
                            prompt +
                            '\n\nBitte antworte im JSON-Format mit einem Array von Objekten, die folgende Felder enthalten: rank, name, location, specialty, revenue2023, revenue2024, employees, marketShare.',
                    },
                ],
                temperature: 0.7,
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API Fehler: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }

    private async queryOpenRouter(apiKey: string, model: string, prompt: string): Promise<string> {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'IT Dashboard',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content:
                            prompt +
                            '\n\nBitte antworte im JSON-Format mit einem Array von Objekten, die folgende Felder enthalten: rank, name, location, specialty, revenue2023, revenue2024, employees, marketShare.',
                    },
                ],
                temperature: 0.7,
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API Fehler: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }

    private async queryDeepSeek(apiKey: string, model: string, prompt: string): Promise<string> {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content:
                            prompt +
                            '\n\nBitte antworte im JSON-Format mit einem Array von Objekten, die folgende Felder enthalten: rank, name, location, specialty, revenue2023, revenue2024, employees, marketShare.',
                    },
                ],
                temperature: 0.7,
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API Fehler: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }

    private parseAIResponse(response: string): any[] {
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const jsonStr = jsonMatch[0];
                const parsed = JSON.parse(jsonStr);

                if (Array.isArray(parsed)) {
                    return parsed.map((item, index) => ({
                        rank: item.rank || index + 1,
                        name: item.name || `Unternehmen ${index + 1}`,
                        location: item.location || 'Deutschland',
                        specialty: item.specialty || 'IT-Dienstleistungen',
                        revenue2023: parseFloat(item.revenue2023) || 0,
                        revenue2024: parseFloat(item.revenue2024) || 0,
                        employees: parseInt(item.employees) || 0,
                        marketShare: parseFloat(item.marketShare) || 0,
                        lastUpdated: new Date(),
                    }));
                }
            }

            // If no JSON found, return empty array
            return [];
        } catch (error) {
            console.error('Error parsing AI response:', error);
            return [];
        }
    }
}

export const aiService = AIService.getInstance();
