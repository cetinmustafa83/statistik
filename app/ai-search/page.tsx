'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, ITCompany, QueryLog } from '../../lib/database';
import { aiService } from '../../lib/aiService';
import { useToast } from '../../lib/toast';

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
    const [searchResults, setSearchResults] = useState<ITCompany[]>([]);
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
                data-oid="k_4jz.7"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="00haffm"
                ></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="p1lbz9x">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="96pkeg3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="buoaty7">
                    <div className="flex justify-between items-center py-4" data-oid="mjl.ah4">
                        <div className="flex items-center space-x-3" data-oid="f-tu7ds">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="obincx5"
                            >
                                <span className="text-white font-bold text-lg" data-oid="f6t1w3v">
                                    AI
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="wj65avc">
                                AI Search
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid=".c8hhmy">
                            <button
                                onClick={goToDashboard}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="az:1q91"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={goToSettings}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="95w004q"
                            >
                                Einstellungen
                            </button>
                            <span className="text-gray-600" data-oid="lzudld:">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="0f8c_em"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="fz0:km0">
                {/* Search Section */}
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
                    data-oid="52juf_p"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4" data-oid=":i0cdlz">
                        AI-gestützte Unternehmenssuche
                    </h2>

                    <div className="space-y-4" data-oid="b4lz5.c">
                        <div className="flex space-x-4" data-oid="od22wl2">
                            <div className="flex-1" data-oid="as_x-0t">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Suchen Sie nach IT-Dienstleistern (z.B. 'Cloud Computing', 'SAP Beratung', 'Cybersecurity')"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="lse_jja"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="wwpddlc"
                            >
                                {isSearching ? (
                                    <div className="flex items-center" data-oid="g.l6q1y">
                                        <div
                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                            data-oid="b_.2b.r"
                                        ></div>
                                        Suchen...
                                    </div>
                                ) : (
                                    'AI Suche'
                                )}
                            </button>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="erpmu_t">
                            <button
                                onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                                data-oid="xpjro-d"
                            >
                                {showCustomPrompt
                                    ? 'Einfache Suche'
                                    : 'Erweiterte Suche (Custom Prompt)'}
                            </button>
                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="text-sm text-gray-600 hover:text-gray-700"
                                data-oid="3pzn_34"
                            >
                                {showAdvancedFilters ? 'Filter ausblenden' : 'Erweiterte Filter'}
                            </button>
                        </div>

                        {showCustomPrompt && (
                            <div data-oid="jbmn0fw">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="e1ge56q"
                                >
                                    Benutzerdefinierter AI-Prompt
                                </label>
                                <textarea
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    rows={3}
                                    placeholder="Geben Sie einen detaillierten Prompt für die AI-Analyse ein..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="h2cx77u"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics Dashboard */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    data-oid="l-gkz4g"
                >
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="ifkv01v"
                    >
                        <div className="flex items-center" data-oid="ubvm6ft">
                            <div
                                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                                data-oid="0wa9s2_"
                            >
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="2vh6hdo"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        data-oid="00zfye_"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="75i3cli">
                                <p className="text-sm font-medium text-gray-600" data-oid="vita44v">
                                    Gesamte Abfragen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="0uqz61g">
                                    {searchStats.totalQueries}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="blyq7z0"
                    >
                        <div className="flex items-center" data-oid="bm2bpiw">
                            <div
                                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                                data-oid="gfeqpfl"
                            >
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="pplir5x"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="p80z.08"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="4584rjt">
                                <p className="text-sm font-medium text-gray-600" data-oid="j-.tt7u">
                                    Erfolgreiche Suchen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="j88ae27">
                                    {searchStats.successfulQueries}
                                </p>
                                <p className="text-xs text-green-600" data-oid="tvjjfhy">
                                    {searchStats.totalQueries > 0
                                        ? `${((searchStats.successfulQueries / searchStats.totalQueries) * 100).toFixed(1)}% Erfolgsrate`
                                        : '0% Erfolgsrate'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="nr:fe07"
                    >
                        <div className="flex items-center" data-oid="j7.-b2b">
                            <div
                                className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"
                                data-oid="0ds:80r"
                            >
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="hqu60c:"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="7p:mj8_"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="7mfm4y_">
                                <p className="text-sm font-medium text-gray-600" data-oid="m_txykj">
                                    Ø Antwortzeit
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="87ll95i">
                                    {searchStats.averageResponseTime.toFixed(1)}s
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="t.4cc5k"
                    >
                        <div className="flex items-center" data-oid="v-2tups">
                            <div
                                className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
                                data-oid="_p5lcnx"
                            >
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="1bc317r"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        data-oid="6jhc-y8"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="np.54wf">
                                <p className="text-sm font-medium text-gray-600" data-oid="lpj3jki">
                                    Gefundene Unternehmen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="yzad3rp">
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
                        data-oid="18.gvea"
                    >
                        <div className="flex justify-between items-center mb-4" data-oid="src__.b">
                            <h3 className="text-lg font-semibold text-gray-900" data-oid="t_eo14d">
                                Erweiterte Filter
                            </h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-600 hover:text-gray-700"
                                data-oid="x4t6-t2"
                            >
                                Filter zurücksetzen
                            </button>
                        </div>

                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            data-oid="e.4749."
                        >
                            <div data-oid="0i_-zxc">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="0o:nzgd"
                                >
                                    Standort
                                </label>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    placeholder="z.B. München, Berlin"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="2mnhb8q"
                                />
                            </div>

                            <div data-oid="m-b_vr5">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="1y9f::9"
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
                                    data-oid="9z24ly."
                                />
                            </div>

                            <div data-oid="i9t6oor">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="m9.qzc7"
                                >
                                    Umsatz 2024 (€{filters.minRevenue}B - €{filters.maxRevenue}B)
                                </label>
                                <div className="flex space-x-2" data-oid="5mqbmjz">
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
                                        data-oid="kgptnvc"
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
                                        data-oid="duqbpa_"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 lg:col-span-3" data-oid="kec5.yv">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="1y_7x8-"
                                >
                                    Mitarbeiteranzahl ({filters.minEmployees.toLocaleString()} -{' '}
                                    {filters.maxEmployees.toLocaleString()})
                                </label>
                                <div className="flex space-x-2" data-oid="gwdgqxh">
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
                                        data-oid="8o:w2y4"
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
                                        data-oid="ft_frqi"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-oid="gng.z7q">
                    {/* Search Results */}
                    <div className="lg:col-span-2" data-oid="9qzsyku">
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100"
                            data-oid="2haqmo_"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="fb55lh9">
                                <h3
                                    className="text-xl font-semibold text-gray-900"
                                    data-oid="r.j25nd"
                                >
                                    Suchergebnisse ({filteredCompanies.length})
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-100" data-oid="lwhtyfy">
                                {filteredCompanies.length > 0 ? (
                                    filteredCompanies.map((company) => (
                                        <div
                                            key={company.rank}
                                            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => setSelectedCompany(company)}
                                            data-oid="lfa_knu"
                                        >
                                            <div
                                                className="flex items-start justify-between"
                                                data-oid="q1jkrfk"
                                            >
                                                <div className="flex-1" data-oid=".3b38ht">
                                                    <div
                                                        className="flex items-center space-x-3 mb-2"
                                                        data-oid="4u3vnys"
                                                    >
                                                        <div
                                                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                            data-oid="7-ey025"
                                                        >
                                                            {company.rank}
                                                        </div>
                                                        <h4
                                                            className="text-lg font-semibold text-gray-900"
                                                            data-oid="33e5lrp"
                                                        >
                                                            {company.name}
                                                        </h4>
                                                    </div>

                                                    <div
                                                        className="grid grid-cols-2 gap-4 text-sm text-gray-600"
                                                        data-oid="z9ja3r4"
                                                    >
                                                        <div data-oid="_ussggw">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="-6zmji2"
                                                            >
                                                                Standort:
                                                            </span>{' '}
                                                            {company.location}
                                                        </div>
                                                        <div data-oid="c:jd0md">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="h.12z6m"
                                                            >
                                                                Spezialisierung:
                                                            </span>{' '}
                                                            {company.specialty}
                                                        </div>
                                                        <div data-oid="paxc:x-">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="mpk5:ch"
                                                            >
                                                                Umsatz 2024:
                                                            </span>{' '}
                                                            €{company.revenue2024}B
                                                        </div>
                                                        <div data-oid="yns1aki">
                                                            <span
                                                                className="font-medium"
                                                                data-oid=":f4ip4q"
                                                            >
                                                                Mitarbeiter:
                                                            </span>{' '}
                                                            {company.employees.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="mt-3 flex items-center space-x-4"
                                                        data-oid="b:5y9q0"
                                                    >
                                                        <span
                                                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                            data-oid="3k-y0bj"
                                                        >
                                                            Marktanteil: {company.marketShare}%
                                                        </span>
                                                        {company.revenue2023 > 0 && (
                                                            <span
                                                                className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                                                                data-oid="wjhjlpj"
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

                                                <div className="ml-4" data-oid="k9i38zu">
                                                    <svg
                                                        className="w-5 h-5 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="1chct3a"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                            data-oid="r.6xr0h"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center" data-oid="zx_8b_k">
                                        <div
                                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                            data-oid="u6wzwk9"
                                        >
                                            <svg
                                                className="w-8 h-8 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="7hv3whp"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    data-oid="o8jf3c3"
                                                />
                                            </svg>
                                        </div>
                                        <h3
                                            className="text-lg font-medium text-gray-900 mb-2"
                                            data-oid="hoaqv_b"
                                        >
                                            Keine Ergebnisse gefunden
                                        </h3>
                                        <p className="text-gray-600" data-oid="imorqmg">
                                            Versuchen Sie eine andere Suchanfrage oder passen Sie
                                            die Filter an.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="space-y-6" data-oid="nvoqu43">
                        {/* Query Trends */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            data-oid="qchjai7"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="h-m:9ol"
                            >
                                Abfrage-Trends (7 Tage)
                            </h3>
                            <div className="space-y-2" data-oid="h5rxdhd">
                                {searchStats.queryTrends.map((trend, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                        data-oid="aeroy3q"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="0dhp22_">
                                            {new Date(trend.date).toLocaleDateString('de-DE', {
                                                weekday: 'short',
                                            })}
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="ald477i"
                                        >
                                            <div
                                                className="w-20 bg-gray-200 rounded-full h-2"
                                                data-oid="kft.9g9"
                                            >
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min((trend.count / Math.max(...searchStats.queryTrends.map((t) => t.count), 1)) * 100, 100)}%`,
                                                    }}
                                                    data-oid="1vhpt_q"
                                                ></div>
                                            </div>
                                            <span
                                                className="text-sm font-medium text-gray-900 w-6"
                                                data-oid="4ywqeqh"
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
                            data-oid="z6sz:wu"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="16.q3oi"
                            >
                                Meist genutzte AI-Provider
                            </h3>
                            <div className="space-y-3" data-oid=":ol3dgv">
                                {searchStats.topProviders.map((provider, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                        data-oid="_0_uek:"
                                    >
                                        <span
                                            className="text-sm font-medium text-gray-700 capitalize"
                                            data-oid="bdsxy__"
                                        >
                                            {provider.provider}
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="furf185"
                                        >
                                            <div
                                                className="w-16 bg-gray-200 rounded-full h-2"
                                                data-oid="kxezd7e"
                                            >
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${(provider.count / Math.max(...searchStats.topProviders.map((p) => p.count), 1)) * 100}%`,
                                                    }}
                                                    data-oid="jnstqf7"
                                                ></div>
                                            </div>
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="1q7qt3l"
                                            >
                                                {provider.count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {searchStats.topProviders.length === 0 && (
                                    <p className="text-sm text-gray-500" data-oid="ityci4i">
                                        Noch keine Daten verfügbar
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent Queries */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            data-oid="43a5_3c"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="biq0n.i"
                            >
                                Letzte Abfragen
                            </h3>
                            <div className="space-y-3" data-oid="itr381r">
                                {queryLogs.slice(0, 5).map((log, index) => (
                                    <div
                                        key={index}
                                        className="border-l-4 border-gray-200 pl-3"
                                        data-oid="xkaw:n_"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="h3rd_28"
                                        >
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    log.success
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                                data-oid="9texj79"
                                            >
                                                {log.success ? 'Erfolgreich' : 'Fehlgeschlagen'}
                                            </span>
                                            <span
                                                className="text-xs text-gray-500"
                                                data-oid="mv1uqkv"
                                            >
                                                {log.timestamp.toLocaleTimeString('de-DE')}
                                            </span>
                                        </div>
                                        <p
                                            className="text-sm text-gray-600 mt-1 truncate"
                                            data-oid="3w8c8qq"
                                        >
                                            {log.prompt}
                                        </p>
                                        <p
                                            className="text-xs text-gray-500 capitalize"
                                            data-oid="gbnacry"
                                        >
                                            {log.provider}
                                        </p>
                                    </div>
                                ))}
                                {queryLogs.length === 0 && (
                                    <p className="text-sm text-gray-500" data-oid="c18.7d-">
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
                        data-oid="auj-auu"
                    >
                        <div
                            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            data-oid="c6a6ebb"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="3.tghk_">
                                <div
                                    className="flex justify-between items-start"
                                    data-oid="xacna-v"
                                >
                                    <div data-oid="g130aon">
                                        <h2
                                            className="text-2xl font-bold text-gray-900"
                                            data-oid="h:2znyf"
                                        >
                                            {selectedCompany.name}
                                        </h2>
                                        <p className="text-gray-600" data-oid="ev0vhxu">
                                            Rang #{selectedCompany.rank}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCompany(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                        data-oid="vrb9liq"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="oa5kr3u"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                                data-oid="31e::xf"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6" data-oid="nt7zbwz">
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    data-oid="3w37a.v"
                                >
                                    <div data-oid="lz56dxb">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-3"
                                            data-oid="d299eux"
                                        >
                                            Unternehmensdaten
                                        </h3>
                                        <div className="space-y-3" data-oid="rq26esw">
                                            <div data-oid="nyw_2:1">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="rx.br_o"
                                                >
                                                    Standort:
                                                </span>
                                                <p className="text-gray-900" data-oid="ubfzwaz">
                                                    {selectedCompany.location}
                                                </p>
                                            </div>
                                            <div data-oid="_r6hann">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="cfyvll_"
                                                >
                                                    Spezialisierung:
                                                </span>
                                                <p className="text-gray-900" data-oid="z.qwi9v">
                                                    {selectedCompany.specialty}
                                                </p>
                                            </div>
                                            <div data-oid="25:qgrc">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="bzem-9o"
                                                >
                                                    Mitarbeiter:
                                                </span>
                                                <p className="text-gray-900" data-oid="j94vh8z">
                                                    {selectedCompany.employees.toLocaleString()}
                                                </p>
                                            </div>
                                            <div data-oid="v9i1cs4">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="536a3uh"
                                                >
                                                    Marktanteil:
                                                </span>
                                                <p className="text-gray-900" data-oid="u5mkqrb">
                                                    {selectedCompany.marketShare}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div data-oid="wizlbm0">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-3"
                                            data-oid="qk54asf"
                                        >
                                            Finanzielle Kennzahlen
                                        </h3>
                                        <div className="space-y-3" data-oid="1.aljrn">
                                            <div data-oid="y9zrji2">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="u46x96l"
                                                >
                                                    Umsatz 2023:
                                                </span>
                                                <p className="text-gray-900" data-oid="pjvg.l8">
                                                    €{selectedCompany.revenue2023}B
                                                </p>
                                            </div>
                                            <div data-oid="419vnoh">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="a2pw3bn"
                                                >
                                                    Umsatz 2024:
                                                </span>
                                                <p className="text-gray-900" data-oid="fvc8cjj">
                                                    €{selectedCompany.revenue2024}B
                                                </p>
                                            </div>
                                            <div data-oid="dbzvv_f">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid=":t3huma"
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
                                                    data-oid="fg4z4y9"
                                                >
                                                    {selectedCompany.revenue2023 > 0
                                                        ? `${(((selectedCompany.revenue2024 - selectedCompany.revenue2023) / selectedCompany.revenue2023) * 100).toFixed(1)}%`
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                            <div data-oid="jjwletv">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="i4ezigq"
                                                >
                                                    Letzte Aktualisierung:
                                                </span>
                                                <p className="text-gray-900" data-oid="d238qzh">
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
