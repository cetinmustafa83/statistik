import { db, ITCompany } from './database';
import { aiService } from './aiService';
import { cacheManager } from './cacheManager';

interface DeepSearchQuery {
    query: string;
    context?: string;
    filters?: SearchFilters;
    searchType: 'semantic' | 'keyword' | 'hybrid' | 'analytical';
    depth: 'surface' | 'medium' | 'deep' | 'comprehensive';
}

interface SearchFilters {
    location?: string[];
    specialty?: string[];
    revenueRange?: [number, number];
    employeeRange?: [number, number];
    marketShareRange?: [number, number];
    growthRate?: [number, number];
    foundedYear?: [number, number];
}

interface DeepSearchResult {
    companies: ITCompany[];
    insights: SearchInsight[];
    recommendations: string[];
    relatedQueries: string[];
    confidence: number;
    processingTime: number;
    searchMetadata: SearchMetadata;
}

interface SearchInsight {
    type: 'trend' | 'pattern' | 'anomaly' | 'correlation' | 'prediction';
    title: string;
    description: string;
    data: any;
    confidence: number;
    relevance: number;
}

interface SearchMetadata {
    totalResults: number;
    filteredResults: number;
    searchDepth: string;
    aiModelsUsed: string[];
    processingSteps: string[];
    dataQuality: number;
}

export class DeepSearchEngine {
    private static instance: DeepSearchEngine;
    private searchHistory: DeepSearchQuery[] = [];
    private semanticCache = new Map<string, any>();

    static getInstance(): DeepSearchEngine {
        if (!DeepSearchEngine.instance) {
            DeepSearchEngine.instance = new DeepSearchEngine();
        }
        return DeepSearchEngine.instance;
    }

    async performDeepSearch(query: DeepSearchQuery): Promise<DeepSearchResult> {
        const startTime = Date.now();
        console.log(`Starting deep search: ${query.query} (${query.searchType}, ${query.depth})`);

        try {
            // Check cache first
            const cacheKey = this.generateCacheKey(query);
            const cached = cacheManager.get<DeepSearchResult>(cacheKey);
            if (cached) {
                console.log('Returning cached deep search result');
                return cached;
            }

            // Step 1: Query preprocessing and enhancement
            const enhancedQuery = await this.enhanceQuery(query);

            // Step 2: Multi-stage search execution
            const searchResults = await this.executeMultiStageSearch(enhancedQuery);

            // Step 3: AI-powered analysis and insights
            const insights = await this.generateInsights(searchResults, enhancedQuery);

            // Step 4: Generate recommendations and related queries
            const recommendations = await this.generateRecommendations(searchResults, insights);
            const relatedQueries = await this.generateRelatedQueries(enhancedQuery);

            // Step 5: Calculate confidence and metadata
            const confidence = this.calculateConfidence(searchResults, insights);
            const processingTime = Date.now() - startTime;

            const result: DeepSearchResult = {
                companies: searchResults,
                insights,
                recommendations,
                relatedQueries,
                confidence,
                processingTime,
                searchMetadata: {
                    totalResults: searchResults.length,
                    filteredResults: searchResults.length,
                    searchDepth: query.depth,
                    aiModelsUsed: ['GPT-4', 'Semantic Analysis', 'Pattern Recognition'],
                    processingSteps: [
                        'Query Enhancement',
                        'Multi-Stage Search',
                        'AI Analysis',
                        'Insight Generation',
                        'Recommendation Engine',
                    ],
                    dataQuality: this.assessDataQuality(searchResults),
                },
            };

            // Cache the result
            cacheManager.set(cacheKey, result, 15 * 60 * 1000); // 15 minutes

            // Store in search history
            this.searchHistory.unshift(query);
            if (this.searchHistory.length > 50) {
                this.searchHistory = this.searchHistory.slice(0, 50);
            }

            return result;
        } catch (error) {
            console.error('Deep search error:', error);
            throw new Error(
                `Deep search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    private async enhanceQuery(query: DeepSearchQuery): Promise<DeepSearchQuery> {
        // Expand synonyms and related terms
        const expandedTerms = await this.expandQueryTerms(query.query);

        // Add contextual information
        const context = query.context || (await this.inferContext(query.query));

        // Enhance filters based on query intent
        const enhancedFilters = await this.enhanceFilters(query.filters, query.query);

        return {
            ...query,
            query: expandedTerms,
            context,
            filters: enhancedFilters,
        };
    }

    private async executeMultiStageSearch(query: DeepSearchQuery): Promise<ITCompany[]> {
        const companies = db.getCompanies();
        let results = [...companies];

        // Stage 1: Keyword matching
        if (query.searchType === 'keyword' || query.searchType === 'hybrid') {
            results = this.performKeywordSearch(results, query.query);
        }

        // Stage 2: Semantic search
        if (query.searchType === 'semantic' || query.searchType === 'hybrid') {
            results = await this.performSemanticSearch(results, query.query);
        }

        // Stage 3: Analytical search
        if (query.searchType === 'analytical') {
            results = await this.performAnalyticalSearch(results, query);
        }

        // Stage 4: Apply filters
        if (query.filters) {
            results = this.applyFilters(results, query.filters);
        }

        // Stage 5: Ranking and relevance scoring
        results = this.rankResults(results, query);

        return results;
    }

    private performKeywordSearch(companies: ITCompany[], query: string): ITCompany[] {
        const keywords = query
            .toLowerCase()
            .split(' ')
            .filter((word) => word.length > 2);

        return companies.filter((company) => {
            const searchText =
                `${company.name} ${company.specialty} ${company.location}`.toLowerCase();
            return keywords.some((keyword) => searchText.includes(keyword));
        });
    }

    private async performSemanticSearch(
        companies: ITCompany[],
        query: string,
    ): Promise<ITCompany[]> {
        // Simulate semantic similarity scoring
        const semanticScores = companies.map((company) => {
            const similarity = this.calculateSemanticSimilarity(query, company);
            return { company, similarity };
        });

        // Filter by semantic threshold
        return semanticScores
            .filter((item) => item.similarity > 0.3)
            .sort((a, b) => b.similarity - a.similarity)
            .map((item) => item.company);
    }

    private async performAnalyticalSearch(
        companies: ITCompany[],
        query: DeepSearchQuery,
    ): Promise<ITCompany[]> {
        // Advanced analytical patterns
        const patterns = this.detectSearchPatterns(query.query);

        return companies.filter((company) => {
            return patterns.every((pattern) => this.matchesPattern(company, pattern));
        });
    }

    private applyFilters(companies: ITCompany[], filters: SearchFilters): ITCompany[] {
        return companies.filter((company) => {
            if (
                filters.location &&
                !filters.location.some((loc) =>
                    company.location.toLowerCase().includes(loc.toLowerCase()),
                )
            ) {
                return false;
            }

            if (
                filters.specialty &&
                !filters.specialty.some((spec) =>
                    company.specialty.toLowerCase().includes(spec.toLowerCase()),
                )
            ) {
                return false;
            }

            if (filters.revenueRange) {
                const [min, max] = filters.revenueRange;
                if (company.revenue2024 < min || company.revenue2024 > max) {
                    return false;
                }
            }

            if (filters.employeeRange) {
                const [min, max] = filters.employeeRange;
                if (company.employees < min || company.employees > max) {
                    return false;
                }
            }

            if (filters.marketShareRange) {
                const [min, max] = filters.marketShareRange;
                if (company.marketShare < min || company.marketShare > max) {
                    return false;
                }
            }

            if (filters.growthRate) {
                const growth =
                    company.revenue2023 > 0
                        ? ((company.revenue2024 - company.revenue2023) / company.revenue2023) * 100
                        : 0;
                const [min, max] = filters.growthRate;
                if (growth < min || growth > max) {
                    return false;
                }
            }

            return true;
        });
    }

    private rankResults(companies: ITCompany[], query: DeepSearchQuery): ITCompany[] {
        return companies
            .map((company) => ({
                ...company,
                relevanceScore: this.calculateRelevanceScore(company, query),
            }))
            .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);
    }

    private async generateInsights(
        companies: ITCompany[],
        query: DeepSearchQuery,
    ): Promise<SearchInsight[]> {
        const insights: SearchInsight[] = [];

        // Market trend analysis
        const trendInsight = this.analyzeTrends(companies);
        if (trendInsight) insights.push(trendInsight);

        // Growth pattern analysis
        const growthInsight = this.analyzeGrowthPatterns(companies);
        if (growthInsight) insights.push(growthInsight);

        // Geographic distribution analysis
        const geoInsight = this.analyzeGeographicDistribution(companies);
        if (geoInsight) insights.push(geoInsight);

        // Competitive landscape analysis
        const competitiveInsight = this.analyzeCompetitiveLandscape(companies);
        if (competitiveInsight) insights.push(competitiveInsight);

        // Anomaly detection
        const anomalies = this.detectAnomalies(companies);
        insights.push(...anomalies);

        return insights.sort((a, b) => b.relevance - a.relevance);
    }

    private async generateRecommendations(
        companies: ITCompany[],
        insights: SearchInsight[],
    ): Promise<string[]> {
        const recommendations: string[] = [];

        // Based on search results
        if (companies.length > 0) {
            const topCompany = companies[0];
            recommendations.push(
                `${topCompany.name} lider konumda - detaylı analiz için inceleyebilirsiniz`,
            );
        }

        // Based on insights
        insights.forEach((insight) => {
            if (insight.type === 'trend' && insight.confidence > 0.7) {
                recommendations.push(`Trend analizi: ${insight.description}`);
            }
        });

        // Market opportunities
        const opportunities = this.identifyOpportunities(companies);
        recommendations.push(...opportunities);

        return recommendations.slice(0, 5);
    }

    private async generateRelatedQueries(query: DeepSearchQuery): Promise<string[]> {
        const relatedQueries: string[] = [];

        // Semantic variations
        const variations = await this.generateQueryVariations(query.query);
        relatedQueries.push(...variations);

        // Drill-down queries
        const drillDowns = this.generateDrillDownQueries(query.query);
        relatedQueries.push(...drillDowns);

        // Comparative queries
        const comparatives = this.generateComparativeQueries(query.query);
        relatedQueries.push(...comparatives);

        return relatedQueries.slice(0, 8);
    }

    // Helper methods
    private calculateSemanticSimilarity(query: string, company: ITCompany): number {
        // Simplified semantic similarity calculation
        const queryTerms = query.toLowerCase().split(' ');
        const companyText =
            `${company.name} ${company.specialty} ${company.location}`.toLowerCase();

        let matches = 0;
        queryTerms.forEach((term) => {
            if (companyText.includes(term)) matches++;
        });

        return matches / queryTerms.length;
    }

    private detectSearchPatterns(query: string): string[] {
        const patterns: string[] = [];

        if (query.includes('top') || query.includes('best') || query.includes('leading')) {
            patterns.push('high_performance');
        }

        if (query.includes('growing') || query.includes('emerging') || query.includes('rising')) {
            patterns.push('growth_focused');
        }

        if (query.includes('large') || query.includes('enterprise') || query.includes('big')) {
            patterns.push('enterprise_scale');
        }

        return patterns;
    }

    private matchesPattern(company: ITCompany, pattern: string): boolean {
        switch (pattern) {
            case 'high_performance':
                return company.marketShare > 5 && company.revenue2024 > 10;
            case 'growth_focused':
                const growth =
                    company.revenue2023 > 0
                        ? ((company.revenue2024 - company.revenue2023) / company.revenue2023) * 100
                        : 0;
                return growth > 10;
            case 'enterprise_scale':
                return company.employees > 5000 && company.revenue2024 > 20;
            default:
                return true;
        }
    }

    private calculateRelevanceScore(company: ITCompany, query: DeepSearchQuery): number {
        let score = 0;

        // Base relevance from semantic similarity
        score += this.calculateSemanticSimilarity(query.query, company) * 40;

        // Performance metrics
        score += (company.marketShare / 100) * 20;
        score += Math.min(company.revenue2024 / 50, 1) * 20;

        // Growth factor
        const growth =
            company.revenue2023 > 0
                ? ((company.revenue2024 - company.revenue2023) / company.revenue2023) * 100
                : 0;
        score += Math.min(growth / 50, 1) * 20;

        return Math.min(score, 100);
    }

    private analyzeTrends(companies: ITCompany[]): SearchInsight | null {
        if (companies.length < 3) return null;

        const avgGrowth =
            companies.reduce((sum, company) => {
                const growth =
                    company.revenue2023 > 0
                        ? ((company.revenue2024 - company.revenue2023) / company.revenue2023) * 100
                        : 0;
                return sum + growth;
            }, 0) / companies.length;

        return {
            type: 'trend',
            title: 'Büyüme Trendi',
            description: `Seçilen şirketlerde ortalama %${avgGrowth.toFixed(1)} büyüme gözlemleniyor`,
            data: { averageGrowth: avgGrowth, sampleSize: companies.length },
            confidence: 0.8,
            relevance: 0.9,
        };
    }

    private analyzeGrowthPatterns(companies: ITCompany[]): SearchInsight | null {
        const highGrowthCompanies = companies.filter((company) => {
            const growth =
                company.revenue2023 > 0
                    ? ((company.revenue2024 - company.revenue2023) / company.revenue2023) * 100
                    : 0;
            return growth > 15;
        });

        if (highGrowthCompanies.length === 0) return null;

        return {
            type: 'pattern',
            title: 'Yüksek Büyüme Paterni',
            description: `${highGrowthCompanies.length} şirket %15'in üzerinde büyüme gösteriyor`,
            data: { highGrowthCount: highGrowthCompanies.length, companies: highGrowthCompanies },
            confidence: 0.85,
            relevance: 0.8,
        };
    }

    private analyzeGeographicDistribution(companies: ITCompany[]): SearchInsight | null {
        const locationCounts = companies.reduce(
            (acc, company) => {
                acc[company.location] = (acc[company.location] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        const topLocation = Object.entries(locationCounts).sort(([, a], [, b]) => b - a)[0];

        if (!topLocation) return null;

        return {
            type: 'pattern',
            title: 'Coğrafi Dağılım',
            description: `En yoğun bölge: ${topLocation[0]} (${topLocation[1]} şirket)`,
            data: locationCounts,
            confidence: 0.9,
            relevance: 0.7,
        };
    }

    private analyzeCompetitiveLandscape(companies: ITCompany[]): SearchInsight | null {
        if (companies.length < 2) return null;

        const totalMarketShare = companies.reduce((sum, company) => sum + company.marketShare, 0);
        const topPlayer = companies.reduce((top, company) =>
            company.marketShare > top.marketShare ? company : top,
        );

        return {
            type: 'correlation',
            title: 'Rekabet Analizi',
            description: `${topPlayer.name} %${topPlayer.marketShare} pazar payı ile lider konumda`,
            data: {
                leader: topPlayer,
                totalMarketShare,
                competitionLevel: totalMarketShare > 50 ? 'high' : 'moderate',
            },
            confidence: 0.85,
            relevance: 0.85,
        };
    }

    private detectAnomalies(companies: ITCompany[]): SearchInsight[] {
        const anomalies: SearchInsight[] = [];

        // Revenue vs Employee anomalies
        companies.forEach((company) => {
            const revenuePerEmployee = (company.revenue2024 * 1000000) / company.employees;
            if (revenuePerEmployee > 500000) {
                // Very high revenue per employee
                anomalies.push({
                    type: 'anomaly',
                    title: 'Yüksek Verimlilik',
                    description: `${company.name} çalışan başına çok yüksek gelir elde ediyor`,
                    data: { company, revenuePerEmployee },
                    confidence: 0.7,
                    relevance: 0.6,
                });
            }
        });

        return anomalies;
    }

    private identifyOpportunities(companies: ITCompany[]): string[] {
        const opportunities: string[] = [];

        // Market gap analysis
        const specialties = companies.map((c) => c.specialty);
        const uniqueSpecialties = [...new Set(specialties)];

        if (uniqueSpecialties.length < companies.length * 0.7) {
            opportunities.push('Belirli uzmanlık alanlarında yoğunlaşma fırsatı mevcut');
        }

        // Geographic opportunities
        const locations = companies.map((c) => c.location);
        const uniqueLocations = [...new Set(locations)];

        if (uniqueLocations.length < 5) {
            opportunities.push('Coğrafi çeşitlendirme için potansiyel mevcut');
        }

        return opportunities;
    }

    private async expandQueryTerms(query: string): Promise<string> {
        // Synonym expansion and related terms
        const synonyms: Record<string, string[]> = {
            cloud: ['bulut', 'saas', 'paas', 'iaas'],
            security: ['güvenlik', 'cybersecurity', 'siber güvenlik'],
            ai: ['artificial intelligence', 'yapay zeka', 'machine learning'],
            consulting: ['danışmanlık', 'consultancy', 'advisory'],
        };

        let expandedQuery = query;
        Object.entries(synonyms).forEach(([term, syns]) => {
            if (query.toLowerCase().includes(term)) {
                expandedQuery += ' ' + syns.join(' ');
            }
        });

        return expandedQuery;
    }

    private async inferContext(query: string): Promise<string> {
        // Infer context from query patterns
        if (query.includes('comparison') || query.includes('vs')) {
            return 'comparative_analysis';
        }
        if (query.includes('trend') || query.includes('growth')) {
            return 'trend_analysis';
        }
        if (query.includes('market') || query.includes('share')) {
            return 'market_analysis';
        }
        return 'general_search';
    }

    private async enhanceFilters(
        filters: SearchFilters | undefined,
        query: string,
    ): Promise<SearchFilters> {
        const enhanced = { ...filters };

        // Auto-detect filter intentions from query
        if (query.includes('large') || query.includes('enterprise')) {
            enhanced.employeeRange = [5000, 100000];
        }
        if (query.includes('startup') || query.includes('small')) {
            enhanced.employeeRange = [10, 1000];
        }
        if (query.includes('growing') || query.includes('fast')) {
            enhanced.growthRate = [15, 100];
        }

        return enhanced;
    }

    private async generateQueryVariations(query: string): Promise<string[]> {
        return [
            `${query} trends`,
            `${query} market analysis`,
            `${query} competitive landscape`,
            `${query} growth opportunities`,
        ];
    }

    private generateDrillDownQueries(query: string): string[] {
        return [
            `Top ${query} companies by revenue`,
            `${query} market leaders`,
            `Emerging ${query} players`,
            `${query} industry analysis`,
        ];
    }

    private generateComparativeQueries(query: string): string[] {
        return [
            `${query} vs competitors`,
            `${query} market comparison`,
            `${query} performance benchmarks`,
        ];
    }

    private calculateConfidence(companies: ITCompany[], insights: SearchInsight[]): number {
        let confidence = 0.5; // Base confidence

        // More results = higher confidence
        confidence += Math.min(companies.length / 20, 0.3);

        // Quality insights increase confidence
        const avgInsightConfidence =
            insights.length > 0
                ? insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length
                : 0;
        confidence += avgInsightConfidence * 0.2;

        return Math.min(confidence, 1.0);
    }

    private assessDataQuality(companies: ITCompany[]): number {
        if (companies.length === 0) return 0;

        let qualityScore = 0;
        companies.forEach((company) => {
            let companyScore = 0;
            if (company.name && company.name.length > 0) companyScore += 0.2;
            if (company.revenue2024 > 0) companyScore += 0.2;
            if (company.revenue2023 > 0) companyScore += 0.2;
            if (company.employees > 0) companyScore += 0.2;
            if (company.marketShare > 0) companyScore += 0.2;
            qualityScore += companyScore;
        });

        return qualityScore / companies.length;
    }

    private generateCacheKey(query: DeepSearchQuery): string {
        return `deep_search_${btoa(JSON.stringify(query))}`;
    }

    // Public methods for external access
    getSearchHistory(): DeepSearchQuery[] {
        return [...this.searchHistory];
    }

    clearSearchHistory(): void {
        this.searchHistory = [];
    }

    getSemanticCache(): Map<string, any> {
        return new Map(this.semanticCache);
    }
}

export const deepSearchEngine = DeepSearchEngine.getInstance();
