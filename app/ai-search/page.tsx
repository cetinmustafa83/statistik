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
                data-oid="es24bxu"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="qiyn1gb"
                ></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="1bg7208">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="_sdrnq4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="qr:7e66">
                    <div className="flex justify-between items-center py-4" data-oid="sogi9v_">
                        <div className="flex items-center space-x-3" data-oid="g1dhwk1">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="b5ob8e1"
                            >
                                <span className="text-white font-bold text-lg" data-oid="b4i9uxl">
                                    AI
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="_w714ji">
                                AI Search
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="7re3bcn">
                            <button
                                onClick={goToDashboard}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="xaqtrdr"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={goToSettings}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="3agt9aa"
                            >
                                Einstellungen
                            </button>
                            <span className="text-gray-600" data-oid="ldr1_zt">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid=".evo-a5"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="wm2l.dv">
                {/* Search Section */}
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
                    data-oid="86fhr-x"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4" data-oid="vt5cmac">
                        AI-gestützte Unternehmenssuche
                    </h2>

                    <div className="space-y-4" data-oid="ijp_ic5">
                        <div className="flex space-x-4" data-oid="it-damm">
                            <div className="flex-1" data-oid="-mz432s">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Suchen Sie nach IT-Dienstleistern (z.B. 'Cloud Computing', 'SAP Beratung', 'Cybersecurity')"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="ukwvci7"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="c5e_2ee"
                            >
                                {isSearching ? (
                                    <div className="flex items-center" data-oid="816ea--">
                                        <div
                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                            data-oid=":n1y3uk"
                                        ></div>
                                        Suchen...
                                    </div>
                                ) : (
                                    'AI Suche'
                                )}
                            </button>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="sm-8du2">
                            <button
                                onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                                data-oid="1.p7b-f"
                            >
                                {showCustomPrompt
                                    ? 'Einfache Suche'
                                    : 'Erweiterte Suche (Custom Prompt)'}
                            </button>
                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="text-sm text-gray-600 hover:text-gray-700"
                                data-oid="75nem4g"
                            >
                                {showAdvancedFilters ? 'Filter ausblenden' : 'Erweiterte Filter'}
                            </button>
                        </div>

                        {showCustomPrompt && (
                            <div data-oid="y7z.ceg">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="lb8.6ie"
                                >
                                    Benutzerdefinierter AI-Prompt
                                </label>
                                <textarea
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    rows={3}
                                    placeholder="Geben Sie einen detaillierten Prompt für die AI-Analyse ein..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="i61ek27"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics Dashboard */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    data-oid="u1bnsns"
                >
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="h.59iv5"
                    >
                        <div className="flex items-center" data-oid="6r0qy1j">
                            <div
                                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                                data-oid="kjtuoa8"
                            >
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="vh:olpo"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        data-oid="6qo32ty"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid=".-jm8m:">
                                <p className="text-sm font-medium text-gray-600" data-oid="sxphvh:">
                                    Gesamte Abfragen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="-i.n-9w">
                                    {searchStats.totalQueries}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="i_cpjwf"
                    >
                        <div className="flex items-center" data-oid="ilt3pec">
                            <div
                                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                                data-oid="rcl23df"
                            >
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="ga2sb9v"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="cpin9p7"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="00askiy">
                                <p className="text-sm font-medium text-gray-600" data-oid="mbs834j">
                                    Erfolgreiche Suchen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="47g2a15">
                                    {searchStats.successfulQueries}
                                </p>
                                <p className="text-xs text-green-600" data-oid="rwrpjqr">
                                    {searchStats.totalQueries > 0
                                        ? `${((searchStats.successfulQueries / searchStats.totalQueries) * 100).toFixed(1)}% Erfolgsrate`
                                        : '0% Erfolgsrate'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="yy2i7wy"
                    >
                        <div className="flex items-center" data-oid="95d4ylo">
                            <div
                                className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"
                                data-oid="t.cpp33"
                            >
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="vmcig.c"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="41k87ao"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="tu1bged">
                                <p className="text-sm font-medium text-gray-600" data-oid="mwd7uus">
                                    Ø Antwortzeit
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="pc2k2gw">
                                    {searchStats.averageResponseTime.toFixed(1)}s
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="4nas6a3"
                    >
                        <div className="flex items-center" data-oid="cdulxkm">
                            <div
                                className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
                                data-oid="z2:ji7_"
                            >
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="eg7osho"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        data-oid="m4_ssb_"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4" data-oid="72p38sh">
                                <p className="text-sm font-medium text-gray-600" data-oid="6mh9r:q">
                                    Gefundene Unternehmen
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="zluqmnw">
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
                        data-oid="zr2j8-4"
                    >
                        <div className="flex justify-between items-center mb-4" data-oid="midh0ba">
                            <h3 className="text-lg font-semibold text-gray-900" data-oid="w9m_2m1">
                                Erweiterte Filter
                            </h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-600 hover:text-gray-700"
                                data-oid="0bq1bc1"
                            >
                                Filter zurücksetzen
                            </button>
                        </div>

                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            data-oid="2q9yo5w"
                        >
                            <div data-oid="in78vx_">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="ghlxbhl"
                                >
                                    Standort
                                </label>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    placeholder="z.B. München, Berlin"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    data-oid="0snqmu5"
                                />
                            </div>

                            <div data-oid="a262rc0">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="2yi.un."
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
                                    data-oid="oqhg7:2"
                                />
                            </div>

                            <div data-oid="oyk6gm4">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="3-3ll3o"
                                >
                                    Umsatz 2024 (€{filters.minRevenue}B - €{filters.maxRevenue}B)
                                </label>
                                <div className="flex space-x-2" data-oid="e.:hx0e">
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
                                        data-oid="2:nv3v9"
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
                                        data-oid="51dwd:8"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 lg:col-span-3" data-oid="n.nstb9">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="955abyx"
                                >
                                    Mitarbeiteranzahl ({filters.minEmployees.toLocaleString()} -{' '}
                                    {filters.maxEmployees.toLocaleString()})
                                </label>
                                <div className="flex space-x-2" data-oid="ez167c7">
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
                                        data-oid="t67airc"
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
                                        data-oid="du82-gz"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-oid="rmpg.lc">
                    {/* Search Results */}
                    <div className="lg:col-span-2" data-oid="cbn:ooc">
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100"
                            data-oid="qk1cb_v"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="4vniqf1">
                                <h3
                                    className="text-xl font-semibold text-gray-900"
                                    data-oid="_5m1v1f"
                                >
                                    Suchergebnisse ({filteredCompanies.length})
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-100" data-oid=":kq98ez">
                                {filteredCompanies.length > 0 ? (
                                    filteredCompanies.map((company) => (
                                        <div
                                            key={company.rank}
                                            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => setSelectedCompany(company)}
                                            data-oid="jwi8v6p"
                                        >
                                            <div
                                                className="flex items-start justify-between"
                                                data-oid="wb7j2on"
                                            >
                                                <div className="flex-1" data-oid="043-t4v">
                                                    <div
                                                        className="flex items-center space-x-3 mb-2"
                                                        data-oid="wd2cbch"
                                                    >
                                                        <div
                                                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                            data-oid="adj4x8r"
                                                        >
                                                            {company.rank}
                                                        </div>
                                                        <h4
                                                            className="text-lg font-semibold text-gray-900"
                                                            data-oid="3-8mbh0"
                                                        >
                                                            {company.name}
                                                        </h4>
                                                    </div>

                                                    <div
                                                        className="grid grid-cols-2 gap-4 text-sm text-gray-600"
                                                        data-oid="yt6j9r5"
                                                    >
                                                        <div data-oid="5n57r48">
                                                            <span
                                                                className="font-medium"
                                                                data-oid=":q8ercx"
                                                            >
                                                                Standort:
                                                            </span>{' '}
                                                            {company.location}
                                                        </div>
                                                        <div data-oid="5qzeiok">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="tttnz_."
                                                            >
                                                                Spezialisierung:
                                                            </span>{' '}
                                                            {company.specialty}
                                                        </div>
                                                        <div data-oid="jy6jxi5">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="uqj2_ut"
                                                            >
                                                                Umsatz 2024:
                                                            </span>{' '}
                                                            €{company.revenue2024}B
                                                        </div>
                                                        <div data-oid="f87ct3d">
                                                            <span
                                                                className="font-medium"
                                                                data-oid="9rly:1v"
                                                            >
                                                                Mitarbeiter:
                                                            </span>{' '}
                                                            {company.employees.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="mt-3 flex items-center space-x-4"
                                                        data-oid="71bwj5u"
                                                    >
                                                        <span
                                                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                            data-oid="oxvcoqm"
                                                        >
                                                            Marktanteil: {company.marketShare}%
                                                        </span>
                                                        {company.revenue2023 > 0 && (
                                                            <span
                                                                className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                                                                data-oid="ja_qimj"
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

                                                <div className="ml-4" data-oid="q.pme6c">
                                                    <svg
                                                        className="w-5 h-5 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="mxqjx9w"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                            data-oid="q50v03v"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center" data-oid="3uvbefs">
                                        <div
                                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                            data-oid="dnfn-ih"
                                        >
                                            <svg
                                                className="w-8 h-8 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="ixdch:-"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    data-oid="k5lcj8b"
                                                />
                                            </svg>
                                        </div>
                                        <h3
                                            className="text-lg font-medium text-gray-900 mb-2"
                                            data-oid="h205ta8"
                                        >
                                            Keine Ergebnisse gefunden
                                        </h3>
                                        <p className="text-gray-600" data-oid="v4w6wjg">
                                            Versuchen Sie eine andere Suchanfrage oder passen Sie
                                            die Filter an.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="space-y-6" data-oid="b7pa8oi">
                        {/* Query Trends */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            data-oid="mhn6_ok"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="8y17i6e"
                            >
                                Abfrage-Trends (7 Tage)
                            </h3>
                            <div className="space-y-2" data-oid="0xlwdy3">
                                {searchStats.queryTrends.map((trend, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                        data-oid="8x6r99f"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="h65.c2p">
                                            {new Date(trend.date).toLocaleDateString('de-DE', {
                                                weekday: 'short',
                                            })}
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="ud8v:ay"
                                        >
                                            <div
                                                className="w-20 bg-gray-200 rounded-full h-2"
                                                data-oid="h3zc-1c"
                                            >
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min((trend.count / Math.max(...searchStats.queryTrends.map((t) => t.count), 1)) * 100, 100)}%`,
                                                    }}
                                                    data-oid="hxji_g."
                                                ></div>
                                            </div>
                                            <span
                                                className="text-sm font-medium text-gray-900 w-6"
                                                data-oid="m3ofr7x"
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
                            data-oid="f246_4x"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="ym8d:wy"
                            >
                                Meist genutzte AI-Provider
                            </h3>
                            <div className="space-y-3" data-oid="qlda-go">
                                {searchStats.topProviders.map((provider, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                        data-oid="9la:e7x"
                                    >
                                        <span
                                            className="text-sm font-medium text-gray-700 capitalize"
                                            data-oid="4fuyggh"
                                        >
                                            {provider.provider}
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="drymzsl"
                                        >
                                            <div
                                                className="w-16 bg-gray-200 rounded-full h-2"
                                                data-oid="2yrrwf2"
                                            >
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${(provider.count / Math.max(...searchStats.topProviders.map((p) => p.count), 1)) * 100}%`,
                                                    }}
                                                    data-oid="6j3t7j7"
                                                ></div>
                                            </div>
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="33297v3"
                                            >
                                                {provider.count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {searchStats.topProviders.length === 0 && (
                                    <p className="text-sm text-gray-500" data-oid="70yrz.m">
                                        Noch keine Daten verfügbar
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent Queries */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            data-oid="dxraesx"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="m_lk27d"
                            >
                                Letzte Abfragen
                            </h3>
                            <div className="space-y-3" data-oid="whic_b:">
                                {queryLogs.slice(0, 5).map((log, index) => (
                                    <div
                                        key={index}
                                        className="border-l-4 border-gray-200 pl-3"
                                        data-oid="h3c_q1b"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="hjfr0:9"
                                        >
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    log.success
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                                data-oid="jak5o-h"
                                            >
                                                {log.success ? 'Erfolgreich' : 'Fehlgeschlagen'}
                                            </span>
                                            <span
                                                className="text-xs text-gray-500"
                                                data-oid="45h8jgh"
                                            >
                                                {log.timestamp.toLocaleTimeString('de-DE')}
                                            </span>
                                        </div>
                                        <p
                                            className="text-sm text-gray-600 mt-1 truncate"
                                            data-oid="e50jpi5"
                                        >
                                            {log.prompt}
                                        </p>
                                        <p
                                            className="text-xs text-gray-500 capitalize"
                                            data-oid="kwbxaqj"
                                        >
                                            {log.provider}
                                        </p>
                                    </div>
                                ))}
                                {queryLogs.length === 0 && (
                                    <p className="text-sm text-gray-500" data-oid="5jocoq8">
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
                        data-oid="7rxw0.p"
                    >
                        <div
                            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            data-oid="v4bjv4o"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="if9:z92">
                                <div
                                    className="flex justify-between items-start"
                                    data-oid="t7zuurs"
                                >
                                    <div data-oid="9am.3--">
                                        <h2
                                            className="text-2xl font-bold text-gray-900"
                                            data-oid="f39g.na"
                                        >
                                            {selectedCompany.name}
                                        </h2>
                                        <p className="text-gray-600" data-oid="yeiv_3r">
                                            Rang #{selectedCompany.rank}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCompany(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                        data-oid="dbw.b9q"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="bimzzcr"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                                data-oid="1es1dl1"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6" data-oid="14xz.ab">
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    data-oid="c.wtjp4"
                                >
                                    <div data-oid="-r07e50">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-3"
                                            data-oid="i_6o7hx"
                                        >
                                            Unternehmensdaten
                                        </h3>
                                        <div className="space-y-3" data-oid="bto6rql">
                                            <div data-oid="schzv2.">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="f16qt2x"
                                                >
                                                    Standort:
                                                </span>
                                                <p className="text-gray-900" data-oid="ie2_ul4">
                                                    {selectedCompany.location}
                                                </p>
                                            </div>
                                            <div data-oid="9ncvdjo">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="l5p.359"
                                                >
                                                    Spezialisierung:
                                                </span>
                                                <p className="text-gray-900" data-oid="z-s8qj2">
                                                    {selectedCompany.specialty}
                                                </p>
                                            </div>
                                            <div data-oid="b0jn:5g">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="b71euq."
                                                >
                                                    Mitarbeiter:
                                                </span>
                                                <p className="text-gray-900" data-oid="cdhmc.w">
                                                    {selectedCompany.employees.toLocaleString()}
                                                </p>
                                            </div>
                                            <div data-oid="1zo:6v3">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="0eoi3j:"
                                                >
                                                    Marktanteil:
                                                </span>
                                                <p className="text-gray-900" data-oid="k52dybx">
                                                    {selectedCompany.marketShare}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div data-oid="y90cwux">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-3"
                                            data-oid="vsise22"
                                        >
                                            Finanzielle Kennzahlen
                                        </h3>
                                        <div className="space-y-3" data-oid="e2e_o34">
                                            <div data-oid="3dx9809">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="w9i78ah"
                                                >
                                                    Umsatz 2023:
                                                </span>
                                                <p className="text-gray-900" data-oid=".pqm_4.">
                                                    €{selectedCompany.revenue2023}B
                                                </p>
                                            </div>
                                            <div data-oid="06zyj8l">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="b.dk_ix"
                                                >
                                                    Umsatz 2024:
                                                </span>
                                                <p className="text-gray-900" data-oid="fl9fku1">
                                                    €{selectedCompany.revenue2024}B
                                                </p>
                                            </div>
                                            <div data-oid="n3gmn5c">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="c9eyvj_"
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
                                                    data-oid=":5w2xgw"
                                                >
                                                    {selectedCompany.revenue2023 > 0
                                                        ? `${(((selectedCompany.revenue2024 - selectedCompany.revenue2023) / selectedCompany.revenue2023) * 100).toFixed(1)}%`
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                            <div data-oid="2ravt8t">
                                                <span
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="cnm2nkf"
                                                >
                                                    Letzte Aktualisierung:
                                                </span>
                                                <p className="text-gray-900" data-oid="4_dvscq">
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
