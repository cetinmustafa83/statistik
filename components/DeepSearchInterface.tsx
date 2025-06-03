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
            data-oid="2ylozv-"
        >
            <div className="space-y-6" data-oid=".zy8d1e">
                {/* Header */}
                <div className="flex items-center justify-between" data-oid=".oqf8sj">
                    <div data-oid="osi3i75">
                        <h2
                            className="text-2xl font-bold text-gray-900 dark:text-white"
                            data-oid="vox698n"
                        >
                            🔍 Deep AI Search
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1" data-oid="32eu_id">
                            Gelişmiş AI ile derin şirket analizi ve içgörüler
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        data-oid="au9zb41"
                    >
                        {showAdvanced ? 'Basit Görünüm' : 'Gelişmiş Ayarlar'}
                    </button>
                </div>

                {/* Main Search Input */}
                <div className="space-y-4" data-oid="g0qgy:x">
                    <div className="relative" data-oid="4_a86kr">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Derin arama sorgunuzu girin... (örn: 'cloud computing alanında hızla büyüyen Almanya merkezli şirketler')"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            rows={3}
                            data-oid="wbst06."
                        />

                        <button
                            onClick={handleDeepSearch}
                            disabled={isSearching || !query.trim()}
                            className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            data-oid="u7qld_-"
                        >
                            {isSearching ? (
                                <div
                                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                                    data-oid="n3ev5n4"
                                ></div>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="nnozjnd"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        data-oid="643uz0j"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Quick Search Options */}
                    <div className="flex flex-wrap gap-2" data-oid="spwilo9">
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
                                data-oid="2kznkop"
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
                        data-oid="2ow0swh"
                    >
                        {/* Search Configuration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="wp6b:y8">
                            <div data-oid="l9iy3g6">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="h3_fycj"
                                >
                                    Arama Türü
                                </label>
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    data-oid="0na6eil"
                                >
                                    <option value="hybrid" data-oid="39xg6ft">
                                        Hibrit Arama
                                    </option>
                                    <option value="semantic" data-oid="3qu5uq2">
                                        Semantik Arama
                                    </option>
                                    <option value="keyword" data-oid="01haguk">
                                        Anahtar Kelime
                                    </option>
                                    <option value="analytical" data-oid="s3m47-p">
                                        Analitik Arama
                                    </option>
                                </select>
                                <p
                                    className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                                    data-oid="8q1en_."
                                >
                                    {getSearchTypeDescription(searchType)}
                                </p>
                            </div>

                            <div data-oid="cjp2j_i">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="le:c34r"
                                >
                                    Arama Derinliği
                                </label>
                                <select
                                    value={searchDepth}
                                    onChange={(e) => setSearchDepth(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    data-oid="9apxo:8"
                                >
                                    <option value="surface" data-oid="cjy52y8">
                                        Yüzeysel
                                    </option>
                                    <option value="medium" data-oid="mhj:8yo">
                                        Orta
                                    </option>
                                    <option value="deep" data-oid="4x6jex5">
                                        Derin
                                    </option>
                                    <option value="comprehensive" data-oid="730x9-x">
                                        Kapsamlı
                                    </option>
                                </select>
                                <p
                                    className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                                    data-oid="ruk60t4"
                                >
                                    {getDepthDescription(searchDepth)}
                                </p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="space-y-4" data-oid=".ls4du-">
                            <div className="flex items-center justify-between" data-oid="5heu7os">
                                <h3
                                    className="text-lg font-medium text-gray-900 dark:text-white"
                                    data-oid="pvq.0_e"
                                >
                                    Filtreler
                                </h3>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    data-oid="cxdumg4"
                                >
                                    Tümünü Temizle
                                </button>
                            </div>

                            {/* Location Filters */}
                            <div data-oid=".i_w0ka">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="f.u43er"
                                >
                                    Lokasyon
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2" data-oid="n2.ap5e">
                                    {filters.location.map((location) => (
                                        <span
                                            key={location}
                                            className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                            data-oid="5yl9av4"
                                        >
                                            {location}
                                            <button
                                                onClick={() => removeLocationFilter(location)}
                                                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                                data-oid="36an5lw"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2" data-oid="dhpbd66">
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
                                            data-oid="z5o8.u1"
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Specialty Filters */}
                            <div data-oid="k45h09w">
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    data-oid="7:yl7u8"
                                >
                                    Uzmanlık Alanı
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2" data-oid="ml9zpp6">
                                    {filters.specialty.map((specialty) => (
                                        <span
                                            key={specialty}
                                            className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                                            data-oid="ad.k2.l"
                                        >
                                            {specialty}
                                            <button
                                                onClick={() => removeSpecialtyFilter(specialty)}
                                                className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                                                data-oid="azg3n0j"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2" data-oid="d.jqoef">
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
                                            data-oid="xd588qb"
                                        >
                                            {spec}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Range Filters */}
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="1bhv-ls"
                            >
                                <div data-oid="z1v9f78">
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        data-oid="1v1i0g:"
                                    >
                                        Gelir Aralığı (€{filters.revenueRange[0]}B - €
                                        {filters.revenueRange[1]}B)
                                    </label>
                                    <div className="flex space-x-2" data-oid="_:zt_ak">
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
                                            data-oid="s3_kbw2"
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
                                            data-oid="lloirf5"
                                        />
                                    </div>
                                </div>

                                <div data-oid="4:ss1ju">
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        data-oid="kuitmcn"
                                    >
                                        Çalışan Sayısı ({filters.employeeRange[0].toLocaleString()}{' '}
                                        - {filters.employeeRange[1].toLocaleString()})
                                    </label>
                                    <div className="flex space-x-2" data-oid="-3-h150">
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
                                            data-oid="tcmy29-"
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
                                            data-oid="-vhw8.d"
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
                        data-oid="xab0lb5"
                    >
                        <div className="flex items-center space-x-3" data-oid="i.r-yq3">
                            <div
                                className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                                data-oid="8nd_d89"
                            ></div>
                            <div data-oid="0_eaox3">
                                <p
                                    className="text-blue-800 dark:text-blue-200 font-medium"
                                    data-oid="215fif3"
                                >
                                    Derin arama işlemi devam ediyor...
                                </p>
                                <p
                                    className="text-blue-600 dark:text-blue-300 text-sm"
                                    data-oid="7uqbzoi"
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
                        data-oid="l1o:9nd"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-oid="ph57ppi">
                            <div className="text-center" data-oid="vjffvaw">
                                <div
                                    className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                                    data-oid="jjyx__9"
                                >
                                    {results.companies.length}
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="jtnxiux"
                                >
                                    Şirket Bulundu
                                </div>
                            </div>
                            <div className="text-center" data-oid="udrlqga">
                                <div
                                    className="text-2xl font-bold text-green-600 dark:text-green-400"
                                    data-oid="fy3zwoe"
                                >
                                    {results.insights.length}
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="z4ed994"
                                >
                                    İçgörü
                                </div>
                            </div>
                            <div className="text-center" data-oid="ab:gnwu">
                                <div
                                    className="text-2xl font-bold text-purple-600 dark:text-purple-400"
                                    data-oid="0iq0idr"
                                >
                                    {Math.round(results.confidence * 100)}%
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="8f7yr41"
                                >
                                    Güven Skoru
                                </div>
                            </div>
                            <div className="text-center" data-oid="g5ydh3k">
                                <div
                                    className="text-2xl font-bold text-orange-600 dark:text-orange-400"
                                    data-oid="1lxv_9j"
                                >
                                    {results.processingTime}ms
                                </div>
                                <div
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="p9n0gx3"
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
