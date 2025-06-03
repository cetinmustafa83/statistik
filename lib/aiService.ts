import { AIModel } from './database';

export class AIService {
    private static instance: AIService;
    private modelsCache: { [provider: string]: AIModel[] } = {};

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    async fetchOpenRouterModels(apiKey: string): Promise<AIModel[]> {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/models', {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Filter for free models only
            const freeModels = data.data
                .filter(
                    (model: any) =>
                        model.pricing?.prompt === 0 ||
                        model.pricing?.prompt === '0' ||
                        model.id.includes('free') ||
                        model.id.includes('llama') ||
                        model.id.includes('mistral') ||
                        model.id.includes('qwen'),
                )
                .map((model: any) => ({
                    id: model.id,
                    name: model.name || model.id,
                    description: model.description,
                    pricing: model.pricing,
                    context_length: model.context_length,
                    free: model.pricing?.prompt === 0 || model.pricing?.prompt === '0',
                }))
                .sort((a: AIModel, b: AIModel) => a.name.localeCompare(b.name));

            this.modelsCache['openrouter'] = freeModels;
            return freeModels;
        } catch (error) {
            console.error('Error fetching OpenRouter models:', error);
            // Return some default free models if API fails
            return this.getDefaultOpenRouterModels();
        }
    }

    getDefaultOpenRouterModels(): AIModel[] {
        return [
            {
                id: 'meta-llama/llama-3.2-3b-instruct:free',
                name: 'Llama 3.2 3B Instruct (Free)',
                description: "Meta's Llama 3.2 3B model, free tier",
                free: true,
            },
            {
                id: 'meta-llama/llama-3.2-1b-instruct:free',
                name: 'Llama 3.2 1B Instruct (Free)',
                description: "Meta's Llama 3.2 1B model, free tier",
                free: true,
            },
            {
                id: 'qwen/qwen-2-7b-instruct:free',
                name: 'Qwen 2 7B Instruct (Free)',
                description: "Alibaba's Qwen 2 7B model, free tier",
                free: true,
            },
            {
                id: 'mistralai/mistral-7b-instruct:free',
                name: 'Mistral 7B Instruct (Free)',
                description: "Mistral AI's 7B model, free tier",
                free: true,
            },
        ];
    }

    getOpenAIModels(): AIModel[] {
        return [
            {
                id: 'gpt-4o',
                name: 'GPT-4o',
                description: 'Most advanced GPT-4 model',
            },
            {
                id: 'gpt-4o-mini',
                name: 'GPT-4o Mini',
                description: 'Faster and cheaper GPT-4 model',
            },
            {
                id: 'gpt-4-turbo',
                name: 'GPT-4 Turbo',
                description: 'High-performance GPT-4 model',
            },
            {
                id: 'gpt-3.5-turbo',
                name: 'GPT-3.5 Turbo',
                description: 'Fast and efficient model',
            },
        ];
    }

    getDeepSeekModels(): AIModel[] {
        return [
            {
                id: 'deepseek-chat',
                name: 'DeepSeek Chat',
                description: "DeepSeek's main chat model",
            },
            {
                id: 'deepseek-coder',
                name: 'DeepSeek Coder',
                description: 'Specialized for coding tasks',
            },
        ];
    }

    async getModelsForProvider(provider: string, apiKey?: string): Promise<AIModel[]> {
        switch (provider) {
            case 'openai':
                return this.getOpenAIModels();
            case 'deepseek':
                return this.getDeepSeekModels();
            case 'openrouter':
                if (apiKey) {
                    return await this.fetchOpenRouterModels(apiKey);
                } else {
                    return this.getDefaultOpenRouterModels();
                }
            default:
                return [];
        }
    }

    getCachedModels(provider: string): AIModel[] {
        return this.modelsCache[provider] || [];
    }
}

export const aiService = AIService.getInstance();
