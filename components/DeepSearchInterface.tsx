'use client';

import { useState, useEffect } from 'react';
import { deepSearchEngine, DeepSearchResult } from '../lib/deepSearchEngine';
import { ITCompany } from '../lib/database';
import { useToast } from '../lib/toast';

interface DeepSearchInterfaceProps {
    onResultsChange?: (results: DeepSearchResult | null) => void;
}

export function DeepSearchInterface({ onResultsChange }: DeepSearchInterfaceProps) {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<'semantic' | 'keyword' | 'hybrid' | 'analytical'>(
        'hybrid',
    );
    const [searchDepth, setSearchDepth] = useState<'surface' | 'medium' | 'deep' | 'comprehensive'>(
        'medium',
    );
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<DeepSearchResult | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filters, setFilters] = useState({
        location: [] as string[],
        specialty: [] as string[],
        revenueRange: [0, 1000] as [number, number],
        employeeRange: [0, 100000] as [number, number],
        marketShareRange: [0, 100] as [number, number],
        growthRate: [-50, 200] as [number, number],
    });

    const { addToast } = useToast();

    const handleDeepSearch = async () => {
        if (!query.trim()) {
            addToast({
                type: 'warning',
                title: 'Arama Sorgusu Gerekli',
                message: 'Lütfen bir arama sorgusu girin.',
            });
            return;
        }

        setIsSearching(true);
        try {
            const searchQuery = {
                query: query.trim(),
                searchType,
                depth: searchDepth,
                filters: {
                    location: filters.location.length > 0 ? filters.location : undefined,
                    specialty: filters.specialty.length > 0 ? filters.specialty : undefined,
                    revenueRange:
                        filters.revenueRange[0] > 0 || filters.revenueRange[1] < 1000
                            ? filters.revenueRange
                            : undefined,
                    employeeRange:
                        filters.employeeRange[0] > 0 || filters.employeeRange[1] < 100000
                            ? filters.employeeRange
                            : undefined,
                    marketShareRange:
                        filters.marketShareRange[0] > 0 || filters.marketShareRange[1] < 100
                            ? filters.marketShareRange
                            : undefined,
                    growthRate:
                        filters.growthRate[0] > -50 || filters.growthRate[1] < 200
                            ? filters.growthRate
                            : undefined,
                },
            };

            const result = await deepSearchEngine.performDeepSearch(searchQuery);
            setResults(result);
            onResultsChange?.(result);

            addToast({
                type: 'success',
                title: 'Derin Arama Tamamlandı',
                message: `${result.companies.length} şirket bulundu, ${result.insights.length} içgörü oluşturuldu (${result.processingTime}ms)`,
            });
        } catch (error) {
            console.error('Deep search error:', error);
            addToast({
                type: 'error',
                title: 'Arama Hatası',
                message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu',
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleDeepSearch();
        }
    };

    const addLocationFilter = (location: string) => {
        if (!filters.location.includes(location)) {
            setFilters((prev) => ({
                ...prev,
                location: [...prev.location, location],
            }));
        }
    };

    const removeLocationFilter = (location: string) => {
        setFilters((prev) => ({
            ...prev,
            location: prev.location.filter((l) => l !== location),
        }));
    };

    const addSpecialtyFilter = (specialty: string) => {
        if (!filters.specialty.includes(specialty)) {
            setFilters((prev) => ({
                ...prev,
                specialty: [...prev.specialty, specialty],
            }));
        }
    };

    const removeSpecialtyFilter = (specialty: string) => {
        setFilters((prev) => ({
            ...prev,
            specialty: prev.specialty.filter((s) => s !== specialty),
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            location: [],
            specialty: [],
            revenueRange: [0, 1000],
            employeeRange: [0, 100000],
            marketShareRange: [0, 100],
            growthRate: [-50, 200],
        });
    };

    const getSearchTypeDescription = (type: string) => {
        switch (type) {
            case 'semantic':
                return 'Anlam tabanlı akıllı arama';
            case 'keyword':
                return 'Anahtar kelime tabanlı hızlı arama';
            case 'hybrid':
                return 'Hibrit arama (önerilen)';
            case 'analytical':
                return 'Analitik pattern tabanlı arama';
            default:
                return '';
        }
    };

    const getDepthDescription = (depth: string) => {
        switch (depth) {
            case 'surface':
                return 'Hızlı yüzeysel arama';
            case 'medium':
                return 'Orta seviye analiz (önerilen)';
            case 'deep':
                return 'Derin analiz ve içgörüler';
            case 'comprehensive':
                return 'Kapsamlı analiz (yavaş)';
            default:
                return '';
        }
    };

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
            data-oid="ydkuim_"
        >
            <div className="space-y-6" data-oid="fd:_3dp">
                {/* Header */}
                <div className="flex items-center justify-between" data-oid="iq2s7u4">
                    <div data-oid="imcuysx">
                        <h2
                            className="text-2xl font-bold text-gray-900 dark:text-white"
                            data-oid="rpfr1x1"
                        >
                            🔍 Deep AI Search
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1" data-oid="k7-.dm:">
                            Gelişmiş AI ile derin şirket analizi ve içgörüler
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        data-oid="ouqln4l"
                    >
                        {showAdvanced ? 'Basit Görünüm' : 'Gelişmiş Ayarlar'}
                    </button>
                </div>

                {/* Main Search Input */}
                <div className="space-y-4" data-oid="y-a1o99">
                    <div className="relative" data-oid="yjy.lsy">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Derin arama sorgunuzu girin... (örn: 'cloud computing alanında hızla büyüyen Almanya merkezli şirketler')"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            rows={3}
                            data-oid="ymh.ne:"
                        />

                        <button
                            onClick={handleDeepSearch}
                            disabled={isSearching || !query.trim()}
                            className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            data-oid="rxky_45"
                        >
                            {isSearching ? (
                                <div
                                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                                    data-oid="sm8kne:"
                                ></div>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="zjkuats"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        data-oid="b.hgn3c"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Quick Search Options */}
                    <div className="flex flex-wrap gap-2" data-oid="o_arjnh">
                        {[
                            'Top IT şirketleri',
                            'Hızla büyüyen startuplar',
                            'Cloud computing liderleri',
                            'AI/ML uzmanları',
                            'Cybersecurity şirketleri',
                            'Enterprise çözümleri',
                        ].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setQuery(suggestion)}
                                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                data-oid="p8jo1be"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Advanced Settings */}
                {showAdvanced && (
                    <div
                        className="space-y-6 border-t border-gray-200 dark:border-gray-600 pt-6"
                        data-oid="q8883qh"
                    >
                        {/* Search Configuration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="6nfjdeb">
                            <div data-oid=".yastoh">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="rtw2alg"
                                >
                                    Arama Türü
                                </label>
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    data-oid="yb.huca"
                                >
                                    <option value="hybrid" data-oid="u2tvhys">
                                        Hibrit Arama
                                    </option>
                                    <option value="semantic" data-oid="lkdg41m">
                                        Semantik Arama
                                    </option>
                                    <option value="keyword" data-oid="zehgqku">
                                        Anahtar Kelime
                                    </option>
                                    <option value="analytical" data-oid="pk19r_c">
                                        Analitik Arama
                                    </option>
                                </select>
                                <p
                                    className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                                    data-oid="7l_ydt0"
                                >
                                    {getSearchTypeDescription(searchType)}
                                </p>
                            </div>

                            <div data-oid="cay_cs.">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="6lxdabs"
                                >
                                    Arama Derinliği
                                </label>
                                <select
                                    value={searchDepth}
                                    onChange={(e) => setSearchDepth(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    data-oid="9-ywimb"
                                >
                                    <option value="surface" data-oid="jrqicb1">
                                        Yüzeysel
                                    </option>
                                    <option value="medium" data-oid="ttv:wyc">
                                        Orta
                                    </option>
                                    <option value="deep" data-oid="x1u_:7:">
                                        Derin
                                    </option>
                                    <option value="comprehensive" data-oid="9:-wdyh">
                                        Kapsamlı
                                    </option>
                                </select>
                                <p
                                    className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                                    data-oid="a.m4gau"
                                >
                                    {getDepthDescription(searchDepth)}
                                </p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="space-y-4" data-oid="q:p3:l6">
                            <div className="flex items-center justify-between" data-oid="1ucaz:x">
                                <h3
                                    className="text-lg font-medium text-gray-900 dark:text-white"
                                    data-oid="vi38f-i"
                                >
                                    Filtreler
                                </h3>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    data-oid="qy6lila"
                                >
                                    Tümünü Temizle
                                </button>
                            </div>

                            {/* Location Filters */}
                            <div data-oid="ff4u0t:">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="wpb:t4x"
                                >
                                    Lokasyon
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2" data-oid="whjqafh">
                                    {filters.location.map((location) => (
                                        <span
                                            key={location}
                                            className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                            data-oid="1czo-4z"
                                        >
                                            {location}
                                            <button
                                                onClick={() => removeLocationFilter(location)}
                                                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                                data-oid="9dj3qfi"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2" data-oid="k_gy6ti">
                                    {[
                                        'Berlin',
                                        'München',
                                        'Hamburg',
                                        'Frankfurt',
                                        'Köln',
                                        'Stuttgart',
                                    ].map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => addLocationFilter(city)}
                                            disabled={filters.location.includes(city)}
                                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            data-oid="q4aiiyv"
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Specialty Filters */}
                            <div data-oid="mhi1tp3">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="kf1nl5a"
                                >
                                    Uzmanlık Alanı
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2" data-oid="1.q9_n1">
                                    {filters.specialty.map((specialty) => (
                                        <span
                                            key={specialty}
                                            className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                                            data-oid="j.k9z-p"
                                        >
                                            {specialty}
                                            <button
                                                onClick={() => removeSpecialtyFilter(specialty)}
                                                className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                                                data-oid="y2.2vrn"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2" data-oid="aa8d5aw">
                                    {[
                                        'Cloud Computing',
                                        'AI/ML',
                                        'Cybersecurity',
                                        'SAP',
                                        'Enterprise Software',
                                        'DevOps',
                                    ].map((spec) => (
                                        <button
                                            key={spec}
                                            onClick={() => addSpecialtyFilter(spec)}
                                            disabled={filters.specialty.includes(spec)}
                                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            data-oid="hosnty0"
                                        >
                                            {spec}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Range Filters */}
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="7nb4u96"
                            >
                                <div data-oid="ua:t8hn">
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        data-oid="qhr4n0h"
                                    >
                                        Gelir Aralığı (€{filters.revenueRange[0]}B - €
                                        {filters.revenueRange[1]}B)
                                    </label>
                                    <div className="flex space-x-2" data-oid=":_56-d1">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000"
                                            value={filters.revenueRange[0]}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    revenueRange: [
                                                        parseInt(e.target.value),
                                                        prev.revenueRange[1],
                                                    ],
                                                }))
                                            }
                                            className="flex-1"
                                            data-oid="5yl8a.w"
                                        />

                                        <input
                                            type="range"
                                            min="0"
                                            max="1000"
                                            value={filters.revenueRange[1]}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    revenueRange: [
                                                        prev.revenueRange[0],
                                                        parseInt(e.target.value),
                                                    ],
                                                }))
                                            }
                                            className="flex-1"
                                            data-oid="cy-87nw"
                                        />
                                    </div>
                                </div>

                                <div data-oid="8tx29t5">
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        data-oid="yrbb9ig"
                                    >
                                        Çalışan Sayısı ({filters.employeeRange[0].toLocaleString()}{' '}
                                        - {filters.employeeRange[1].toLocaleString()})
                                    </label>
                                    <div className="flex space-x-2" data-oid="04nxc84">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100000"
                                            step="1000"
                                            value={filters.employeeRange[0]}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    employeeRange: [
                                                        parseInt(e.target.value),
                                                        prev.employeeRange[1],
                                                    ],
                                                }))
                                            }
                                            className="flex-1"
                                            data-oid="3dbi.st"
                                        />

                                        <input
                                            type="range"
                                            min="0"
                                            max="100000"
                                            step="1000"
                                            value={filters.employeeRange[1]}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    employeeRange: [
                                                        prev.employeeRange[0],
                                                        parseInt(e.target.value),
                                                    ],
                                                }))
                                            }
                                            className="flex-1"
                                            data-oid="y.m9-a4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Status */}
                {isSearching && (
                    <div
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                        data-oid="kbvqg21"
                    >
                        <div className="flex items-center space-x-3" data-oid="l2bgspn">
                            <div
                                className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                                data-oid="id9puh0"
                            ></div>
                            <div data-oid="oegabak">
                                <p
                                    className="text-blue-800 dark:text-blue-200 font-medium"
                                    data-oid="s5dingf"
                                >
                                    Derin arama işlemi devam ediyor...
                                </p>
                                <p
                                    className="text-blue-600 dark:text-blue-300 text-sm"
                                    data-oid="b1l1iog"
                                >
                                    AI modelleri analiz yapıyor ve içgörüler oluşturuyor
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                {results && (
                    <div
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                        data-oid="iyo5_04"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-oid="p..a3:y">
                            <div className="text-center" data-oid="u5w4q-v">
                                <div
                                    className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                                    data-oid="uilzqh0"
                                >
                                    {results.companies.length}
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="5ut5-3h"
                                >
                                    Şirket Bulundu
                                </div>
                            </div>
                            <div className="text-center" data-oid="p8-_3do">
                                <div
                                    className="text-2xl font-bold text-green-600 dark:text-green-400"
                                    data-oid="08au-z3"
                                >
                                    {results.insights.length}
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="lczde4p"
                                >
                                    İçgörü
                                </div>
                            </div>
                            <div className="text-center" data-oid="gnqv_pz">
                                <div
                                    className="text-2xl font-bold text-purple-600 dark:text-purple-400"
                                    data-oid="famxrwl"
                                >
                                    {Math.round(results.confidence * 100)}%
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="qm11t_5"
                                >
                                    Güven Skoru
                                </div>
                            </div>
                            <div className="text-center" data-oid="7.5yzqi">
                                <div
                                    className="text-2xl font-bold text-orange-600 dark:text-orange-400"
                                    data-oid="xab35ur"
                                >
                                    {results.processingTime}ms
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="kto45hl"
                                >
                                    İşlem Süresi
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
