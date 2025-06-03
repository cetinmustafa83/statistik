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
                data-oid="vzfx_qg"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="80z681e"
                ></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="v5.zcrz">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="f9zjfug">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="_bey1ne">
                    <div className="flex justify-between items-center py-4" data-oid="k3it.cu">
                        <div className="flex items-center space-x-3" data-oid="-j3qhkw">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="1sogt4e"
                            >
                                <span className="text-white font-bold text-lg" data-oid="udjhzae">
                                    AI
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="y81ia6q">
                                AI Search
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="55tx3q1">
                            <button
                                onClick={goToDashboard}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="siz-92u"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={goToSettings}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="sizp-ss"
                            >
                                Einstellungen
                            </button>
                            <span className="text-gray-600" data-oid="8.yulgg">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="7naq7i6"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="9w5dj44">
                {/* Search Section */}
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
                    data-oid=":oe8t_r"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4" data-oid="l4j0_8o">
                        AI-gestützte Unternehmenssuche
                    </h2>

                    <div className="space-y-4" data-oid="e4d8el8">
                        <div className="flex space-x-4" data-oid="zx4c1yr">
                            <div className="flex-1" data-oid="dih91ci">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Suchen Sie nach IT-Dienstleistern (z.B. 'Cloud Computing', 'SAP Beratung', 'Cybersecurity')"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="5zynm.k"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="w-b-68x"
                            >
                                {isSearching ? (
                                    <div className="flex items-center" data-oid="iijw2ot">
                                        <div
                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                            data-oid="x82qjwx"
                                        ></div>
                                        Suchen...
                                    </div>
                                ) : (
                                    'AI Suche'
                                )}
                            </button>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="z1lb7gh">
                            <button
                                onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                                data-oid="7:66485"
                            >
                                {showCustomPrompt
                                    ? 'Einfache Suche'
                                    : 'Erweiterte Suche (Custom Prompt)'}
                            </button>
                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="text-sm text-gray-600 hover:text-gray-700"
                                data-oid="mnyv5t_"
                            >
                                {showAdvancedFilters ? 'Filter ausblenden' : 'Erweiterte Filter'}
                            </button>
                        </div>

                        {showCustomPrompt && (
                            <div data-oid="fhtu6ux">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="2wqyobn"
                                >
                                    Benutzerdefinierter AI-Prompt
                                </label>
                                <textarea
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    rows={3}
                                    placeholder="Geben Sie einen detaillierten Prompt für die AI-Analyse ein..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="yawy0yn"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics Dashboard */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    data-oid="jxowi08"
                >
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="4-_8d9i"
                    >
                        <div className="flex items-center" data-oid="lq.i8qp">
                            <div
                                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                                data-oid="j2k92wj"
                            >
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="yjug-04"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        data-oid="mfxsgd9"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="9int43f">
                                <p className="text-sm font-medium text-gray-600" data-oid="fbk58aq">
                                    Gesamte Abfragen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="6jo9c21">
                                    {searchStats.totalQueries}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="a220doe"
                    >
                        <div className="flex items-center" data-oid="px6blr-">
                            <div
                                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                                data-oid="lk31tiu"
                            >
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="rwjj3ay"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="yminmq6"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="u--iqza">
                                <p className="text-sm font-medium text-gray-600" data-oid=":1q8akn">
                                    Erfolgreiche Suchen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="emk87qd">
                                    {searchStats.successfulQueries}
                                </p>
                                <p className="text-xs text-green-600" data-oid="w7jgao7">
                                    {searchStats.totalQueries > 0
                                        ? `${((searchStats.successfulQueries / searchStats.totalQueries) * 100).toFixed(1)}% Erfolgsrate`
                                        : '0% Erfolgsrate'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="nk.-dvn"
                    >
                        <div className="flex items-center" data-oid="vu6spc4">
                            <div
                                className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"
                                data-oid="dei29ga"
                            >
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="_tqi3:x"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="4qtzyzd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="8eryir5">
                                <p className="text-sm font-medium text-gray-600" data-oid="wp:eos8">
                                    Ø Antwortzeit
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="g9j:42d">
                                    {searchStats.averageResponseTime.toFixed(1)}s
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="vpdegxw"
                    >
                        <div className="flex items-center" data-oid="8huv906">
                            <div
                                className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
                                data-oid="xjjca-."
                            >
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="_re05mq"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        data-oid="_dm7ve3"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="n6:v11v">
                                <p className="text-sm font-medium text-gray-600" data-oid="tmpc403">
                                    Gefundene Unternehmen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="cbqkf7.">
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
                        data-oid="gtlbyw1"
                    >
                        <div className="flex justify-between items-center mb-4" data-oid="mu8bj26">
                            <h3 className="text-lg font-semibold text-gray-900" data-oid="rbudsik">
                                Erweiterte Filter
                            </h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-600 hover:text-gray-700"
                                data-oid="q3:wjgf"
                            >
                                Filter zurücksetzen
                            </button>
                        </div>

                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            data-oid="m0hb710"
                        >
                            <div data-oid="f5gs-mv">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="g7sg:hb"
                                >
                                    Standort
                                </label>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    placeholder="z.B. München, Berlin"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="4-ijs.t"
                                />
                            </div>

                            <div data-oid="7bfiwab">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="5ctf5dg"
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
                                    data-oid="4oinakw"
                                />
                            </div>

                            <div data-oid="hf2wnet">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="d-em_:2"
                                >
                                    Umsatz 2024 (€{filters.minRevenue}B - €{filters.maxRevenue}B)
                                </label>
                                <div className="flex space-x-2" data-oid="rjos0cq">
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
                                        data-oid="gwgk1b2"
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
                                        data-oid="r2rqr0n"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 lg:col-span-3" data-oid="ky_o7nl">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="jwr28rf"
                                >
                                    Mitarbeiteranzahl ({filters.minEmployees.toLocaleString()} -{' '}
                                    {filters.maxEmployees.toLocaleString()})
                                </label>
                                <div className="flex space-x-2" data-oid="fe-6ku9">
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
                                        data-oid="8b.f1zn"
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
                                        data-oid="6daiu:0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-oid="zg03.a6">
                    {/* Search Results */}
                    <div className="lg:col-span-2" data-oid="bwn6mtg">
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100"
                            data-oid="n10.c:b"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="ll_o3.y">
                                <h3
                                    className="text-xl font-semibold text-gray-900"
                                    data-oid="pv.g1sk"
                                >
                                    Suchergebnisse ({filteredCompanies.length})
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-100" data-oid="na2l-7.">
                                {filteredCompanies.length > 0 ? (
                                    filteredCompanies.map((company) => (
                                        <div
                                            key={company.rank}
                                            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => setSelectedCompany(company)}
                                            data-oid="f_8r.o5"
                                        >
                                            <div
                                                className="flex items-start justify-between"
                                                data-oid="::cllds"
                                            >
                                                <div className="flex-1" data-oid="doo7sws">
                                                    <div
                                                        className="flex items-center space-x-3 mb-2"
                                                        data-oid="ag506el"
                                                    >
                                                        <div
                                                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                            data-oid="y-v_f_m"
                                                        >
                                                            {company.rank}
                                                        </div>
                                                        <h4
                                                            className="text-lg font-semibold text-gray-900"
                                                            data-oid="6u4fnb-"
                                                        >
                                                            {company.name}
                                                        </h4>
                                                    </div>

                                                    <div
                                                        className="grid grid-cols-2 gap-4 text-sm text-gray-600"
                                                        data-oid="--bymha"
                                                    >
                                                        <div data-oid="lt919bi">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="lk-3tqt"
                                                            >
                                                                Standort:
                                                            </span>{' '}
                                                            {company.location}
                                                        </div>
                                                        <div data-oid="di4.pzt">
                                                            <span
                                                                className="font-medium"
                                                                data-oid=".2dzwux"
                                                            >
                                                                Spezialisierung:
                                                            </span>{' '}
                                                            {company.specialty}
                                                        </div>
                                                        <div data-oid="tvyb7z5">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="wsi6lz5"
                                                            >
                                                                Umsatz 2024:
                                                            </span>{' '}
                                                            €{company.revenue2024}B
                                                        </div>
                                                        <div data-oid="d8.:rhw">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="pyaxu6t"
                                                            >
                                                                Mitarbeiter:
                                                            </span>{' '}
                                                            {company.employees.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="mt-3 flex items-center space-x-4"
                                                        data-oid="l74hesl"
                                                    >
                                                        <span
                                                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                            data-oid="xjdl35p"
                                                        >
                                                            Marktanteil: {company.marketShare}%
                                                        </span>
                                                        {company.revenue2023 > 0 && (
                                                            <span
                                                                className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                                                                data-oid="5oso:ek"
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

                                                <div className="ml-4" data-oid="iwn.m21">
                                                    <svg
                                                        className="w-5 h-5 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid=":_dcliy"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                            data-oid="6vp2jx0"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center" data-oid="d9o1ta2">
                                        <div
                                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                            data-oid="38gvupc"
                                        >
                                            <svg
                                                className="w-8 h-8 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="tqzoqmw"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    data-oid="zpjekr4"
                                                />
                                            </svg>
                                        </div>
                                        <h3
                                            className="text-lg font-medium text-gray-900 mb-2"
                                            data-oid="laodfin"
                                        >
                                            Keine Ergebnisse gefunden
                                        </h3>
                                        <p className="text-gray-600" data-oid="n4p8qmz">
                                            Versuchen Sie eine andere Suchanfrage oder passen Sie
                                            die Filter an.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="space-y-6" data-oid="hdkdapn">
                        {/* Query Trends */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            data-oid="-3py.ww"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="2ze8di6"
                            >
                                Abfrage-Trends (7 Tage)
                            </h3>
                            <div className="space-y-2" data-oid="svqjfcv">
                                {searchStats.queryTrends.map((trend, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                        data-oid="2fb7ehu"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="8c-nw-.">
                                            {new Date(trend.date).toLocaleDateString('de-DE', {
                                                weekday: 'short',
                                            })}
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="ogo5mkm"
                                        >
                                            <div
                                                className="w-20 bg-gray-200 rounded-full h-2"
                                                data-oid="437o9v_"
                                            >
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min((trend.count / Math.max(...searchStats.queryTrends.map((t) => t.count), 1)) * 100, 100)}%`,
                                                    }}
                                                    data-oid="7dzuw8-"
                                                ></div>
                                            </div>
                                            <span
                                                className="text-sm font-medium text-gray-900 w-6"
                                                data-oid="9n2ppwf"
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
                            data-oid="qij:h73"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="538h4r-"
                            >
                                Meist genutzte AI-Provider
                            </h3>
                            <div className="space-y-3" data-oid="ubwmmm5">
                                {searchStats.topProviders.map((provider, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                        data-oid="xd98xcl"
                                    >
                                        <span
                                            className="text-sm font-medium text-gray-700 capitalize"
                                            data-oid="jwc41r1"
                                        >
                                            {provider.provider}
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="sm_coxu"
                                        >
                                            <div
                                                className="w-16 bg-gray-200 rounded-full h-2"
                                                data-oid=".b73..u"
                                            >
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${(provider.count / Math.max(...searchStats.topProviders.map((p) => p.count), 1)) * 100}%`,
                                                    }}
                                                    data-oid="wf15zft"
                                                ></div>
                                            </div>
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="a0r.1qr"
                                            >
                                                {provider.count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {searchStats.topProviders.length === 0 && (
                                    <p className="text-sm text-gray-500" data-oid="x5-p5d8">
                                        Noch keine Daten verfügbar
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent Queries */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            data-oid="mz1vsgx"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="8p85wxm"
                            >
                                Letzte Abfragen
                            </h3>
                            <div className="space-y-3" data-oid="iicqmbs">
                                {queryLogs.slice(0, 5).map((log, index) => (
                                    <div
                                        key={index}
                                        className="border-l-4 border-gray-200 pl-3"
                                        data-oid="3u_2b5b"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="t.8ss.y"
                                        >
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    log.success
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                                data-oid=".zpmn4i"
                                            >
                                                {log.success ? 'Erfolgreich' : 'Fehlgeschlagen'}
                                            </span>
                                            <span
                                                className="text-xs text-gray-500"
                                                data-oid="wg.z6zr"
                                            >
                                                {log.timestamp.toLocaleTimeString('de-DE')}
                                            </span>
                                        </div>
                                        <p
                                            className="text-sm text-gray-600 mt-1 truncate"
                                            data-oid="dn7na1h"
                                        >
                                            {log.prompt}
                                        </p>
                                        <p
                                            className="text-xs text-gray-500 capitalize"
                                            data-oid="njpqnx7"
                                        >
                                            {log.provider}
                                        </p>
                                    </div>
                                ))}
                                {queryLogs.length === 0 && (
                                    <p className="text-sm text-gray-500" data-oid="sxdeyje">
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
                        data-oid="wz0ia-a"
                    >
                        <div
                            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            data-oid="i_vnh4r"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid=".9gktje">
                                <div
                                    className="flex justify-between items-start"
                                    data-oid="qzzvzln"
                                >
                                    <div data-oid="uai:ppc">
                                        <h2
                                            className="text-2xl font-bold text-gray-900"
                                            data-oid="pkneqb_"
                                        >
                                            {selectedCompany.name}
                                        </h2>
                                        <p className="text-gray-600" data-oid="h::.ssp">
                                            Rang #{selectedCompany.rank}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCompany(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                        data-oid="z7s5cs5"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="g_j0z1j"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                                data-oid="57yi-zv"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6" data-oid="fgh6h6.">
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    data-oid="yzs0cde"
                                >
                                    <div data-oid="kkpby82">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-3"
                                            data-oid="jfgx5m0"
                                        >
                                            Unternehmensdaten
                                        </h3>
                                        <div className="space-y-3" data-oid="g87nou1">
                                            <div data-oid="9z1_r_i">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="d7bry3i"
                                                >
                                                    Standort:
                                                </span>
                                                <p className="text-gray-900" data-oid="61viflo">
                                                    {selectedCompany.location}
                                                </p>
                                            </div>
                                            <div data-oid="6bgp8r-">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="y9m59fk"
                                                >
                                                    Spezialisierung:
                                                </span>
                                                <p className="text-gray-900" data-oid="88y494e">
                                                    {selectedCompany.specialty}
                                                </p>
                                            </div>
                                            <div data-oid="2779eeb">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="-a15ckl"
                                                >
                                                    Mitarbeiter:
                                                </span>
                                                <p className="text-gray-900" data-oid="6.xbsn5">
                                                    {selectedCompany.employees.toLocaleString()}
                                                </p>
                                            </div>
                                            <div data-oid="xxue:7j">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="baqa6xl"
                                                >
                                                    Marktanteil:
                                                </span>
                                                <p className="text-gray-900" data-oid="nes43x:">
                                                    {selectedCompany.marketShare}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div data-oid="y76x1ot">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-3"
                                            data-oid="j8_pyow"
                                        >
                                            Finanzielle Kennzahlen
                                        </h3>
                                        <div className="space-y-3" data-oid="4g32g1c">
                                            <div data-oid=":ukz-6o">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="vfy8.1_"
                                                >
                                                    Umsatz 2023:
                                                </span>
                                                <p className="text-gray-900" data-oid="jc01.t_">
                                                    €{selectedCompany.revenue2023}B
                                                </p>
                                            </div>
                                            <div data-oid="-g1edb4">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="g0c-l:g"
                                                >
                                                    Umsatz 2024:
                                                </span>
                                                <p className="text-gray-900" data-oid="r3tlqre">
                                                    €{selectedCompany.revenue2024}B
                                                </p>
                                            </div>
                                            <div data-oid="gja.1br">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="cn6ca9m"
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
                                                    data-oid="8_lgf0p"
                                                >
                                                    {selectedCompany.revenue2023 > 0
                                                        ? `${(((selectedCompany.revenue2024 - selectedCompany.revenue2023) / selectedCompany.revenue2023) * 100).toFixed(1)}%`
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                            <div data-oid="y77vd6w">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="w.mlnn:"
                                                >
                                                    Letzte Aktualisierung:
                                                </span>
                                                <p className="text-gray-900" data-oid="6cqo:e4">
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
