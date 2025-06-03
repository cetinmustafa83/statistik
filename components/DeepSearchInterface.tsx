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
            data-oid="6vv:z.v"
        >
            <div className="space-y-6" data-oid="ur9h54v">
                {/* Header */}
                <div className="flex items-center justify-between" data-oid="05y09jj">
                    <div data-oid="ksy5-tn">
                        <h2
                            className="text-2xl font-bold text-gray-900 dark:text-white"
                            data-oid="h_xq313"
                        >
                            🔍 Deep AI Search
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1" data-oid="8wgx219">
                            Gelişmiş AI ile derin şirket analizi ve içgörüler
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        data-oid="vhn.lk_"
                    >
                        {showAdvanced ? 'Basit Görünüm' : 'Gelişmiş Ayarlar'}
                    </button>
                </div>

                {/* Main Search Input */}
                <div className="space-y-4" data-oid="gq21aqd">
                    <div className="relative" data-oid="_412p80">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Derin arama sorgunuzu girin... (örn: 'cloud computing alanında hızla büyüyen Almanya merkezli şirketler')"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            rows={3}
                            data-oid="cp45c-d"
                        />

                        <button
                            onClick={handleDeepSearch}
                            disabled={isSearching || !query.trim()}
                            className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            data-oid="52jrweh"
                        >
                            {isSearching ? (
                                <div
                                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                                    data-oid="4_6svi8"
                                ></div>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="2zx8tla"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        data-oid="o6_j5og"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Quick Search Options */}
                    <div className="flex flex-wrap gap-2" data-oid="yw41y4v">
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
                                data-oid="tu5zx53"
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
                        data-oid="vl2.5ty"
                    >
                        {/* Search Configuration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="-js4vq:">
                            <div data-oid="tycusul">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="y9mw2tw"
                                >
                                    Arama Türü
                                </label>
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    data-oid="tdm6p3v"
                                >
                                    <option value="hybrid" data-oid="apsli4z">
                                        Hibrit Arama
                                    </option>
                                    <option value="semantic" data-oid="8cuj:0r">
                                        Semantik Arama
                                    </option>
                                    <option value="keyword" data-oid="g3dc_jz">
                                        Anahtar Kelime
                                    </option>
                                    <option value="analytical" data-oid="zun9qmu">
                                        Analitik Arama
                                    </option>
                                </select>
                                <p
                                    className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                                    data-oid="qvglg:o"
                                >
                                    {getSearchTypeDescription(searchType)}
                                </p>
                            </div>

                            <div data-oid="ypmd5g5">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="h6-x5f5"
                                >
                                    Arama Derinliği
                                </label>
                                <select
                                    value={searchDepth}
                                    onChange={(e) => setSearchDepth(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    data-oid="j8anl5i"
                                >
                                    <option value="surface" data-oid="zkmboel">
                                        Yüzeysel
                                    </option>
                                    <option value="medium" data-oid="wo5kx_k">
                                        Orta
                                    </option>
                                    <option value="deep" data-oid="h:rrldh">
                                        Derin
                                    </option>
                                    <option value="comprehensive" data-oid="fp79fp1">
                                        Kapsamlı
                                    </option>
                                </select>
                                <p
                                    className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                                    data-oid="g:x2nco"
                                >
                                    {getDepthDescription(searchDepth)}
                                </p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="space-y-4" data-oid="lzd1k8g">
                            <div className="flex items-center justify-between" data-oid="ohfr0pn">
                                <h3
                                    className="text-lg font-medium text-gray-900 dark:text-white"
                                    data-oid="owtn:3_"
                                >
                                    Filtreler
                                </h3>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    data-oid="s9r9r.m"
                                >
                                    Tümünü Temizle
                                </button>
                            </div>

                            {/* Location Filters */}
                            <div data-oid="lncmrhn">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="m7.lan."
                                >
                                    Lokasyon
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2" data-oid="5j_ky2m">
                                    {filters.location.map((location) => (
                                        <span
                                            key={location}
                                            className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                            data-oid="4_s4erd"
                                        >
                                            {location}
                                            <button
                                                onClick={() => removeLocationFilter(location)}
                                                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                                data-oid="u3qd_za"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2" data-oid="y77fu2a">
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
                                            data-oid="poy:tzd"
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Specialty Filters */}
                            <div data-oid="nzrze.:">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="_sn4flg"
                                >
                                    Uzmanlık Alanı
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2" data-oid="ieavj2-">
                                    {filters.specialty.map((specialty) => (
                                        <span
                                            key={specialty}
                                            className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                                            data-oid="xbsuhqm"
                                        >
                                            {specialty}
                                            <button
                                                onClick={() => removeSpecialtyFilter(specialty)}
                                                className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                                                data-oid="va65y97"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2" data-oid="cc0ux_-">
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
                                            data-oid="q-:6ah5"
                                        >
                                            {spec}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Range Filters */}
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="wb-sa2-"
                            >
                                <div data-oid="xzk_sr-">
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        data-oid="mggg4gi"
                                    >
                                        Gelir Aralığı (€{filters.revenueRange[0]}B - €
                                        {filters.revenueRange[1]}B)
                                    </label>
                                    <div className="flex space-x-2" data-oid="fv2.b75">
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
                                            data-oid="701rsrs"
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
                                            data-oid="6vg70wx"
                                        />
                                    </div>
                                </div>

                                <div data-oid="rafzzxl">
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        data-oid="kdcgakg"
                                    >
                                        Çalışan Sayısı ({filters.employeeRange[0].toLocaleString()}{' '}
                                        - {filters.employeeRange[1].toLocaleString()})
                                    </label>
                                    <div className="flex space-x-2" data-oid="rti.5-r">
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
                                            data-oid="8dxzlfp"
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
                                            data-oid="nn_gd4l"
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
                        data-oid=":vij4q4"
                    >
                        <div className="flex items-center space-x-3" data-oid="dvbzfl.">
                            <div
                                className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                                data-oid="vhw4xlv"
                            ></div>
                            <div data-oid="v47277i">
                                <p
                                    className="text-blue-800 dark:text-blue-200 font-medium"
                                    data-oid="gp374n-"
                                >
                                    Derin arama işlemi devam ediyor...
                                </p>
                                <p
                                    className="text-blue-600 dark:text-blue-300 text-sm"
                                    data-oid="onfsgqk"
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
                        data-oid="wpookja"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-oid="5zm9x9x">
                            <div className="text-center" data-oid="-8dirg1">
                                <div
                                    className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                                    data-oid="8k7n6i2"
                                >
                                    {results.companies.length}
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="x4qv0cl"
                                >
                                    Şirket Bulundu
                                </div>
                            </div>
                            <div className="text-center" data-oid="de2rd:t">
                                <div
                                    className="text-2xl font-bold text-green-600 dark:text-green-400"
                                    data-oid="kibq-cz"
                                >
                                    {results.insights.length}
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="r5wtx5b"
                                >
                                    İçgörü
                                </div>
                            </div>
                            <div className="text-center" data-oid="g:zfmdt">
                                <div
                                    className="text-2xl font-bold text-purple-600 dark:text-purple-400"
                                    data-oid="mvbl8m5"
                                >
                                    {Math.round(results.confidence * 100)}%
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="wp6gewi"
                                >
                                    Güven Skoru
                                </div>
                            </div>
                            <div className="text-center" data-oid="q:i.voy">
                                <div
                                    className="text-2xl font-bold text-orange-600 dark:text-orange-400"
                                    data-oid="id_0.ap"
                                >
                                    {results.processingTime}ms
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="4jpa_.w"
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
