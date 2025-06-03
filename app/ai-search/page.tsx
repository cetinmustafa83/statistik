'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, ITCompany, QueryLog } from '../../lib/database';
import { aiService } from '../../lib/aiService';
import { useToast } from '../../lib/toast';
import { DeepSearchInterface } from '../../components/DeepSearchInterface';
import { DeepSearchResults } from '../../components/DeepSearchResults';
import { DeepSearchResult } from '../../lib/deepSearchEngine';

interface SearchFilters {
    location: string;
    specialty: string;
    minRevenue: number;
    maxRevenue: number;
    minEmployees: number;
    maxEmployees: number;
}

interface SearchStats {
    totalQueries: number;
    successfulQueries: number;
    failedQueries: number;
    averageResponseTime: number;
    lastQueryTime: Date | null;
    topProviders: { provider: string; count: number }[];
    queryTrends: { date: string; count: number }[];
}

export default function AISearchPage() {
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [companies, setCompanies] = useState<ITCompany[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<ITCompany[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<DeepSearchResult | null>(null);
    const [classicResults, setClassicResults] = useState<ITCompany[]>([]);
    const [queryLogs, setQueryLogs] = useState<QueryLog[]>([]);
    const [searchStats, setSearchStats] = useState<SearchStats>({
        totalQueries: 0,
        successfulQueries: 0,
        failedQueries: 0,
        averageResponseTime: 0,
        lastQueryTime: null,
        topProviders: [],
        queryTrends: [],
    });
    const [filters, setFilters] = useState<SearchFilters>({
        location: '',
        specialty: '',
        minRevenue: 0,
        maxRevenue: 1000,
        minEmployees: 0,
        maxEmployees: 100000,
    });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<ITCompany | null>(null);
    const [customPrompt, setCustomPrompt] = useState('');
    const [showCustomPrompt, setShowCustomPrompt] = useState(false);

    const router = useRouter();
    const { addToast } = useToast();

    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const email = localStorage.getItem('userEmail');

        if (!isLoggedIn) {
            router.push('/');
            return;
        }

        setUserEmail(email || '');
        loadData();
        setIsLoading(false);
    }, [router]);

    const loadData = () => {
        try {
            const companiesData = db.getCompanies();
            const logs = db.getQueryLogs(100);

            setCompanies(companiesData);
            setFilteredCompanies(companiesData);
            setQueryLogs(logs);
            calculateSearchStats(logs);
        } catch (error) {
            console.error('Error loading data:', error);
            addToast({
                type: 'error',
                title: 'Fehler beim Laden',
                message: 'Daten konnten nicht geladen werden.',
            });
        }
    };

    const calculateSearchStats = (logs: QueryLog[]) => {
        const totalQueries = logs.length;
        const successfulQueries = logs.filter((log) => log.success).length;
        const failedQueries = totalQueries - successfulQueries;

        // Calculate average response time (simulated)
        const averageResponseTime = logs.length > 0 ? 2.5 : 0;

        // Get last query time
        const lastQueryTime = logs.length > 0 ? logs[0].timestamp : null;

        // Calculate top providers
        const providerCounts = logs.reduce(
            (acc, log) => {
                acc[log.provider] = (acc[log.provider] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        const topProviders = Object.entries(providerCounts)
            .map(([provider, count]) => ({ provider, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        // Calculate query trends (last 7 days)
        const queryTrends = calculateQueryTrends(logs);

        setSearchStats({
            totalQueries,
            successfulQueries,
            failedQueries,
            averageResponseTime,
            lastQueryTime,
            topProviders,
            queryTrends,
        });
    };

    const calculateQueryTrends = (logs: QueryLog[]) => {
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
    };

    const handleSearch = async () => {
        if (!searchQuery.trim() && !customPrompt.trim()) {
            addToast({
                type: 'warning',
                title: 'Suchbegriff erforderlich',
                message: 'Bitte geben Sie einen Suchbegriff oder benutzerdefinierten Prompt ein.',
            });
            return;
        }

        const apiSettings = db.getAPISettings();
        if (!apiSettings) {
            addToast({
                type: 'error',
                title: 'API-Einstellungen fehlen',
                message: 'Bitte konfigurieren Sie zuerst Ihre AI-Einstellungen.',
            });
            router.push('/settings');
            return;
        }

        setIsSearching(true);
        const startTime = Date.now();

        try {
            // Update the prompt in settings if custom prompt is provided
            if (customPrompt.trim()) {
                db.saveAPISettings({
                    ...apiSettings,
                    prompt: customPrompt,
                });
            } else {
                // Use search query to create a dynamic prompt
                const dynamicPrompt = `Analysiere IT-Dienstleister in Deutschland mit Fokus auf: ${searchQuery}. Berücksichtige dabei Marktposition, Spezialisierung, Umsatz und Mitarbeiteranzahl.`;
                db.saveAPISettings({
                    ...apiSettings,
                    prompt: dynamicPrompt,
                });
            }

            const result = await aiService.queryAI();
            const endTime = Date.now();
            const responseTime = (endTime - startTime) / 1000;

            if (result.success) {
                const newCompanies = db.getCompanies();
                setSearchResults(newCompanies);
                setCompanies(newCompanies);
                applyFilters(newCompanies);

                addToast({
                    type: 'success',
                    title: 'Suche erfolgreich',
                    message: `${newCompanies.length} Unternehmen gefunden in ${responseTime.toFixed(1)}s`,
                });
            } else {
                addToast({
                    type: 'error',
                    title: 'Suchfehler',
                    message: result.error || 'Die AI-Suche konnte nicht durchgeführt werden.',
                });
            }

            // Reload logs and stats
            loadData();
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Unerwarteter Fehler',
                message: 'Ein unerwarteter Fehler ist aufgetreten.',
            });
        } finally {
            setIsSearching(false);
        }
    };

    const applyFilters = (companiesToFilter: ITCompany[] = companies) => {
        let filtered = companiesToFilter;

        if (filters.location) {
            filtered = filtered.filter((company) =>
                company.location.toLowerCase().includes(filters.location.toLowerCase()),
            );
        }

        if (filters.specialty) {
            filtered = filtered.filter((company) =>
                company.specialty.toLowerCase().includes(filters.specialty.toLowerCase()),
            );
        }

        filtered = filtered.filter(
            (company) =>
                company.revenue2024 >= filters.minRevenue &&
                company.revenue2024 <= filters.maxRevenue &&
                company.employees >= filters.minEmployees &&
                company.employees <= filters.maxEmployees,
        );

        setFilteredCompanies(filtered);
    };

    const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        applyFilters();
    };

    const clearFilters = () => {
        const defaultFilters: SearchFilters = {
            location: '',
            specialty: '',
            minRevenue: 0,
            maxRevenue: 1000,
            minEmployees: 0,
            maxEmployees: 100000,
        };
        setFilters(defaultFilters);
        setFilteredCompanies(companies);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    const goToDashboard = () => {
        router.push('/dashboard');
    };

    const goToSettings = () => {
        router.push('/settings');
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="w6qapu:"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="rekc571"
                ></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="-j831c7">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="iz5vm5j">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="7cgwhml">
                    <div className="flex justify-between items-center py-4" data-oid="_gxb:3b">
                        <div className="flex items-center space-x-3" data-oid="hppc-yz">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="v1-tot-"
                            >
                                <span className="text-white font-bold text-lg" data-oid="rsza3m1">
                                    AI
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="tux.b0y">
                                AI Search
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="9f6735x">
                            <button
                                onClick={goToDashboard}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="gd6cc:_"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={goToSettings}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="-vk9ouw"
                            >
                                Einstellungen
                            </button>
                            <span className="text-gray-600" data-oid="8i77or.">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="qduh64c"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid=":56o4n6">
                {/* Search Section */}
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
                    data-oid="g2a9lwy"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4" data-oid="8.6.9kj">
                        AI-gestützte Unternehmenssuche
                    </h2>

                    <div className="space-y-4" data-oid="p6p0k.g">
                        <div className="flex space-x-4" data-oid="a-m:t1u">
                            <div className="flex-1" data-oid="d-w-05r">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Suchen Sie nach IT-Dienstleistern (z.B. 'Cloud Computing', 'SAP Beratung', 'Cybersecurity')"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="3k5dp:p"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="zkvhwhl"
                            >
                                {isSearching ? (
                                    <div className="flex items-center" data-oid="dtdd8ns">
                                        <div
                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                            data-oid="cb_r9:r"
                                        ></div>
                                        Suchen...
                                    </div>
                                ) : (
                                    'AI Suche'
                                )}
                            </button>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="wgq8hqo">
                            <button
                                onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                                data-oid="ylnsxbl"
                            >
                                {showCustomPrompt
                                    ? 'Einfache Suche'
                                    : 'Erweiterte Suche (Custom Prompt)'}
                            </button>
                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="text-sm text-gray-600 hover:text-gray-700"
                                data-oid="8kbt-z-"
                            >
                                {showAdvancedFilters ? 'Filter ausblenden' : 'Erweiterte Filter'}
                            </button>
                        </div>

                        {showCustomPrompt && (
                            <div data-oid="78d97:7">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="a5jcd8o"
                                >
                                    Benutzerdefinierter AI-Prompt
                                </label>
                                <textarea
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    rows={3}
                                    placeholder="Geben Sie einen detaillierten Prompt für die AI-Analyse ein..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="gdicj6t"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics Dashboard */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    data-oid="02f:89j"
                >
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="w2-mqdu"
                    >
                        <div className="flex items-center" data-oid="1kxm73q">
                            <div
                                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                                data-oid="reay38-"
                            >
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="01m6.xm"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        data-oid="rkpr8p7"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="6_mfnjn">
                                <p className="text-sm font-medium text-gray-600" data-oid="uq-e9t3">
                                    Gesamte Abfragen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="xnado20">
                                    {searchStats.totalQueries}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="yigkrcv"
                    >
                        <div className="flex items-center" data-oid="c7r.ssf">
                            <div
                                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                                data-oid="o3z8ojy"
                            >
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="iddxwgm"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="jc_nn6:"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="9d8c2pj">
                                <p className="text-sm font-medium text-gray-600" data-oid="jkly2kk">
                                    Erfolgreiche Suchen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="0.c3.s5">
                                    {searchStats.successfulQueries}
                                </p>
                                <p className="text-xs text-green-600" data-oid="prd6dp8">
                                    {searchStats.totalQueries > 0
                                        ? `${((searchStats.successfulQueries / searchStats.totalQueries) * 100).toFixed(1)}% Erfolgsrate`
                                        : '0% Erfolgsrate'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="xswbsc9"
                    >
                        <div className="flex items-center" data-oid="8grw7ul">
                            <div
                                className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"
                                data-oid="nx7xpwn"
                            >
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="gord54r"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="6l_ra.."
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="sl-mbxg">
                                <p className="text-sm font-medium text-gray-600" data-oid="ujur7n.">
                                    Ø Antwortzeit
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="2e3ocda">
                                    {searchStats.averageResponseTime.toFixed(1)}s
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="xiwmr_-"
                    >
                        <div className="flex items-center" data-oid="9-s::cq">
                            <div
                                className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
                                data-oid="pvmu9.-"
                            >
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="1bd-t1d"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        data-oid="nyy3ub3"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="u27mvbr">
                                <p className="text-sm font-medium text-gray-600" data-oid="jdg-y2l">
                                    Gefundene Unternehmen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="d3k60ue">
                                    {filteredCompanies.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
                        data-oid="xjudc3f"
                    >
                        <div className="flex justify-between items-center mb-4" data-oid="fndgjy2">
                            <h3 className="text-lg font-semibold text-gray-900" data-oid="zy2y28:">
                                Erweiterte Filter
                            </h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-600 hover:text-gray-700"
                                data-oid="ytppc2a"
                            >
                                Filter zurücksetzen
                            </button>
                        </div>

                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            data-oid="g_d_e8z"
                        >
                            <div data-oid="l.c:5wp">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="6qyhol:"
                                >
                                    Standort
                                </label>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    placeholder="z.B. München, Berlin"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid=":-lne45"
                                />
                            </div>

                            <div data-oid="w--xgb.">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="wq4weqt"
                                >
                                    Spezialisierung
                                </label>
                                <input
                                    type="text"
                                    value={filters.specialty}
                                    onChange={(e) =>
                                        handleFilterChange('specialty', e.target.value)
                                    }
                                    placeholder="z.B. Cloud, SAP, Security"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="tz6ra91"
                                />
                            </div>

                            <div data-oid="63rj5_t">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="zow9vfw"
                                >
                                    Umsatz 2024 (€{filters.minRevenue}B - €{filters.maxRevenue}B)
                                </label>
                                <div className="flex space-x-2" data-oid="2f300_e">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={filters.minRevenue}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'minRevenue',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="flex-1"
                                        data-oid="uxap2uq"
                                    />

                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={filters.maxRevenue}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'maxRevenue',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="flex-1"
                                        data-oid=".fbexjm"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 lg:col-span-3" data-oid="m6w18or">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="bhn2rvm"
                                >
                                    Mitarbeiteranzahl ({filters.minEmployees.toLocaleString()} -{' '}
                                    {filters.maxEmployees.toLocaleString()})
                                </label>
                                <div className="flex space-x-2" data-oid="7hcmvet">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100000"
                                        step="1000"
                                        value={filters.minEmployees}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'minEmployees',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="flex-1"
                                        data-oid="auyam1p"
                                    />

                                    <input
                                        type="range"
                                        min="0"
                                        max="100000"
                                        step="1000"
                                        value={filters.maxEmployees}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'maxEmployees',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="flex-1"
                                        data-oid="yf0xle2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-oid="j9ng3mi">
                    {/* Search Results */}
                    <div className="lg:col-span-2" data-oid="x0eocly">
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100"
                            data-oid="lwca9wc"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="cpkjpf_">
                                <h3
                                    className="text-xl font-semibold text-gray-900"
                                    data-oid="e4qik9_"
                                >
                                    Suchergebnisse ({filteredCompanies.length})
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-100" data-oid="rl73o:x">
                                {filteredCompanies.length > 0 ? (
                                    filteredCompanies.map((company) => (
                                        <div
                                            key={company.rank}
                                            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => setSelectedCompany(company)}
                                            data-oid="fa2nw-k"
                                        >
                                            <div
                                                className="flex items-start justify-between"
                                                data-oid=".as9m41"
                                            >
                                                <div className="flex-1" data-oid="_a4vmem">
                                                    <div
                                                        className="flex items-center space-x-3 mb-2"
                                                        data-oid="2ug2z4."
                                                    >
                                                        <div
                                                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                            data-oid="n5btyic"
                                                        >
                                                            {company.rank}
                                                        </div>
                                                        <h4
                                                            className="text-lg font-semibold text-gray-900"
                                                            data-oid="9rr45mm"
                                                        >
                                                            {company.name}
                                                        </h4>
                                                    </div>

                                                    <div
                                                        className="grid grid-cols-2 gap-4 text-sm text-gray-600"
                                                        data-oid="tqdbane"
                                                    >
                                                        <div data-oid="o39p.u5">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="vj:a3_h"
                                                            >
                                                                Standort:
                                                            </span>{' '}
                                                            {company.location}
                                                        </div>
                                                        <div data-oid="2ztkem_">
                                                            <span
                                                                className="font-medium"
                                                                data-oid=":dgg2dm"
                                                            >
                                                                Spezialisierung:
                                                            </span>{' '}
                                                            {company.specialty}
                                                        </div>
                                                        <div data-oid="a4o6gbe">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="bnqzd-5"
                                                            >
                                                                Umsatz 2024:
                                                            </span>{' '}
                                                            €{company.revenue2024}B
                                                        </div>
                                                        <div data-oid="gpyu74p">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="hnstut5"
                                                            >
                                                                Mitarbeiter:
                                                            </span>{' '}
                                                            {company.employees.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="mt-3 flex items-center space-x-4"
                                                        data-oid="88hfwoi"
                                                    >
                                                        <span
                                                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                            data-oid="erwd:xb"
                                                        >
                                                            Marktanteil: {company.marketShare}%
                                                        </span>
                                                        {company.revenue2023 > 0 && (
                                                            <span
                                                                className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                                                                data-oid="6dtu1ry"
                                                            >
                                                                Wachstum: +
                                                                {(
                                                                    ((company.revenue2024 -
                                                                        company.revenue2023) /
                                                                        company.revenue2023) *
                                                                    100
                                                                ).toFixed(1)}
                                                                %
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="ml-4" data-oid="lzyx7js">
                                                    <svg
                                                        className="w-5 h-5 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="uvg4fq4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                            data-oid="ok0pd0k"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center" data-oid="9httlp8">
                                        <div
                                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                            data-oid="2hxv15b"
                                        >
                                            <svg
                                                className="w-8 h-8 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="kff5sa2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    data-oid="--6z_.l"
                                                />
                                            </svg>
                                        </div>
                                        <h3
                                            className="text-lg font-medium text-gray-900 mb-2"
                                            data-oid="w:z5-6k"
                                        >
                                            Keine Ergebnisse gefunden
                                        </h3>
                                        <p className="text-gray-600" data-oid="wf0a0fs">
                                            Versuchen Sie eine andere Suchanfrage oder passen Sie
                                            die Filter an.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="space-y-6" data-oid="em1byfe">
                        {/* Query Trends */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            data-oid="g4e:1gr"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="ypqzq0e"
                            >
                                Abfrage-Trends (7 Tage)
                            </h3>
                            <div className="space-y-2" data-oid="-n:m0:b">
                                {searchStats.queryTrends.map((trend, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                        data-oid=":3hws2o"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="ofs8rwc">
                                            {new Date(trend.date).toLocaleDateString('de-DE', {
                                                weekday: 'short',
                                            })}
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="gg:m_6q"
                                        >
                                            <div
                                                className="w-20 bg-gray-200 rounded-full h-2"
                                                data-oid="ejs.9dl"
                                            >
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min((trend.count / Math.max(...searchStats.queryTrends.map((t) => t.count), 1)) * 100, 100)}%`,
                                                    }}
                                                    data-oid="9ofz4g:"
                                                ></div>
                                            </div>
                                            <span
                                                className="text-sm font-medium text-gray-900 w-6"
                                                data-oid="3tud5nq"
                                            >
                                                {trend.count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Providers */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            data-oid="2o5cqim"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="er11ssn"
                            >
                                Meist genutzte AI-Provider
                            </h3>
                            <div className="space-y-3" data-oid="15ur5r.">
                                {searchStats.topProviders.map((provider, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                        data-oid="r7ml2ik"
                                    >
                                        <span
                                            className="text-sm font-medium text-gray-700 capitalize"
                                            data-oid="xl_61g5"
                                        >
                                            {provider.provider}
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="q.qa_gz"
                                        >
                                            <div
                                                className="w-16 bg-gray-200 rounded-full h-2"
                                                data-oid="g380pse"
                                            >
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${(provider.count / Math.max(...searchStats.topProviders.map((p) => p.count), 1)) * 100}%`,
                                                    }}
                                                    data-oid="nibc4jb"
                                                ></div>
                                            </div>
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="_n.m3-0"
                                            >
                                                {provider.count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {searchStats.topProviders.length === 0 && (
                                    <p className="text-sm text-gray-500" data-oid="3e0pt._">
                                        Noch keine Daten verfügbar
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent Queries */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            data-oid="0yxwmqb"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="ftfpyf6"
                            >
                                Letzte Abfragen
                            </h3>
                            <div className="space-y-3" data-oid="-r6jqdk">
                                {queryLogs.slice(0, 5).map((log, index) => (
                                    <div
                                        key={index}
                                        className="border-l-4 border-gray-200 pl-3"
                                        data-oid="n:jy34a"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="fxaoyd:"
                                        >
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    log.success
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                                data-oid="beuh9ms"
                                            >
                                                {log.success ? 'Erfolgreich' : 'Fehlgeschlagen'}
                                            </span>
                                            <span
                                                className="text-xs text-gray-500"
                                                data-oid="3g:4gn9"
                                            >
                                                {log.timestamp.toLocaleTimeString('de-DE')}
                                            </span>
                                        </div>
                                        <p
                                            className="text-sm text-gray-600 mt-1 truncate"
                                            data-oid="35jsd46"
                                        >
                                            {log.prompt}
                                        </p>
                                        <p
                                            className="text-xs text-gray-500 capitalize"
                                            data-oid="--dxi0x"
                                        >
                                            {log.provider}
                                        </p>
                                    </div>
                                ))}
                                {queryLogs.length === 0 && (
                                    <p className="text-sm text-gray-500" data-oid="4w-nb78">
                                        Noch keine Abfragen durchgeführt
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Detail Modal */}
                {selectedCompany && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        data-oid="iw7b1ch"
                    >
                        <div
                            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            data-oid="mks2kw7"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="75xyocj">
                                <div
                                    className="flex justify-between items-start"
                                    data-oid="pw5eugq"
                                >
                                    <div data-oid="1-maa7z">
                                        <h2
                                            className="text-2xl font-bold text-gray-900"
                                            data-oid="98.ms8i"
                                        >
                                            {selectedCompany.name}
                                        </h2>
                                        <p className="text-gray-600" data-oid="wz__l1z">
                                            Rang #{selectedCompany.rank}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCompany(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                        data-oid="vaig5yw"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="8fsm6vg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                                data-oid="nzwqp90"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6" data-oid="tu79.5j">
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    data-oid="1lju205"
                                >
                                    <div data-oid="zc-9ig2">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-3"
                                            data-oid=":qeiteo"
                                        >
                                            Unternehmensdaten
                                        </h3>
                                        <div className="space-y-3" data-oid="gn2civf">
                                            <div data-oid="uf2_4lu">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="vjkevpx"
                                                >
                                                    Standort:
                                                </span>
                                                <p className="text-gray-900" data-oid="vgpgeu8">
                                                    {selectedCompany.location}
                                                </p>
                                            </div>
                                            <div data-oid="1cuc2td">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="pkjxah-"
                                                >
                                                    Spezialisierung:
                                                </span>
                                                <p className="text-gray-900" data-oid="k6cl:i6">
                                                    {selectedCompany.specialty}
                                                </p>
                                            </div>
                                            <div data-oid="tsrt0vl">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="0gyhd-c"
                                                >
                                                    Mitarbeiter:
                                                </span>
                                                <p className="text-gray-900" data-oid="enljr-i">
                                                    {selectedCompany.employees.toLocaleString()}
                                                </p>
                                            </div>
                                            <div data-oid="bc0.g8m">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="kelfz4h"
                                                >
                                                    Marktanteil:
                                                </span>
                                                <p className="text-gray-900" data-oid="h-m.yxn">
                                                    {selectedCompany.marketShare}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div data-oid="q-j5mfs">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-3"
                                            data-oid="q:0e3m5"
                                        >
                                            Finanzielle Kennzahlen
                                        </h3>
                                        <div className="space-y-3" data-oid="iruzngi">
                                            <div data-oid="fd_fay8">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="bo.xn9."
                                                >
                                                    Umsatz 2023:
                                                </span>
                                                <p className="text-gray-900" data-oid="5re18a:">
                                                    €{selectedCompany.revenue2023}B
                                                </p>
                                            </div>
                                            <div data-oid="0q2xekn">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="5l8xe71"
                                                >
                                                    Umsatz 2024:
                                                </span>
                                                <p className="text-gray-900" data-oid="0z-xlyn">
                                                    €{selectedCompany.revenue2024}B
                                                </p>
                                            </div>
                                            <div data-oid="ouli.ii">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="g-qwiqv"
                                                >
                                                    Wachstum:
                                                </span>
                                                <p
                                                    className={`font-semibold ${
                                                        selectedCompany.revenue2024 >
                                                        selectedCompany.revenue2023
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                    data-oid="xbkkvm:"
                                                >
                                                    {selectedCompany.revenue2023 > 0
                                                        ? `${(((selectedCompany.revenue2024 - selectedCompany.revenue2023) / selectedCompany.revenue2023) * 100).toFixed(1)}%`
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                            <div data-oid="9cb.vda">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="id9dlyg"
                                                >
                                                    Letzte Aktualisierung:
                                                </span>
                                                <p className="text-gray-900" data-oid="5-z4km3">
                                                    {selectedCompany.lastUpdated.toLocaleString(
                                                        'de-DE',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
