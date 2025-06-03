'use client';

import { useState } from 'react';
import { DeepSearchResult } from '../lib/deepSearchEngine';
import { ITCompany } from '../lib/database';

interface DeepSearchResultsProps {
    results: DeepSearchResult | null;
    onCompanySelect?: (company: ITCompany) => void;
}

export function DeepSearchResults({ results, onCompanySelect }: DeepSearchResultsProps) {
    const [activeTab, setActiveTab] = useState<
        'companies' | 'insights' | 'recommendations' | 'metadata'
    >('companies');
    const [selectedInsightType, setSelectedInsightType] = useState<string>('all');

    if (!results) {
        return (
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center"
                data-oid="-llw-ls"
            >
                <div
                    className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
                    data-oid="0-w8.b_"
                >
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="vdlaxpn"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            data-oid="5q0j0::"
                        />
                    </svg>
                </div>
                <h3
                    className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                    data-oid="nyk9.am"
                >
                    Derin Arama Sonucu Bekleniyor
                </h3>
                <p className="text-gray-600 dark:text-gray-300" data-oid="l91k-gc">
                    Yukarıdaki arama kutusunu kullanarak derin AI analizi başlatın
                </p>
            </div>
        );
    }

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'trend':
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="8125vdx"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            data-oid=".lt4ot_"
                        />
                    </svg>
                );

            case 'pattern':
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="c5ucrlm"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            data-oid="v13q6k3"
                        />
                    </svg>
                );

            case 'anomaly':
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="j7lgzsq"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            data-oid="-8oe96."
                        />
                    </svg>
                );

            case 'correlation':
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="uw7ve2w"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            data-oid="nl30qbw"
                        />
                    </svg>
                );

            case 'prediction':
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="int91uz"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            data-oid="1-4e.jc"
                        />
                    </svg>
                );

            default:
                return (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="dofb-rh"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            data-oid="-td6gn_"
                        />
                    </svg>
                );
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
        if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const filteredInsights =
        selectedInsightType === 'all'
            ? results.insights
            : results.insights.filter((insight) => insight.type === selectedInsightType);

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            data-oid="lkne.6p"
        >
            {/* Header with Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-600" data-oid="tfz4bj6">
                <div className="px-6 py-4" data-oid="hzoya9y">
                    <div className="flex items-center justify-between mb-4" data-oid="458irss">
                        <h2
                            className="text-xl font-bold text-gray-900 dark:text-white"
                            data-oid="hz8m-rp"
                        >
                            Derin Arama Sonuçları
                        </h2>
                        <div
                            className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300"
                            data-oid="j:0:vjq"
                        >
                            <span data-oid="-irj.4s">
                                Güven:{' '}
                                <span
                                    className={getConfidenceColor(results.confidence)}
                                    data-oid="7gfj7k7"
                                >
                                    {Math.round(results.confidence * 100)}%
                                </span>
                            </span>
                            <span data-oid="8yfs8lz">Süre: {results.processingTime}ms</span>
                        </div>
                    </div>

                    <nav className="flex space-x-8" data-oid="0hdt-xy">
                        {[
                            {
                                id: 'companies',
                                label: 'Şirketler',
                                count: results.companies.length,
                            },
                            { id: 'insights', label: 'İçgörüler', count: results.insights.length },
                            {
                                id: 'recommendations',
                                label: 'Öneriler',
                                count: results.recommendations.length,
                            },
                            { id: 'metadata', label: 'Metadata', count: null },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                                data-oid="3z3o_t3"
                            >
                                {tab.label}
                                {tab.count !== null && (
                                    <span
                                        className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full"
                                        data-oid="lwbz_cp"
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6" data-oid="vy8-r8m">
                {/* Companies Tab */}
                {activeTab === 'companies' && (
                    <div className="space-y-4" data-oid="glvjqc0">
                        {results.companies.length > 0 ? (
                            results.companies.map((company, index) => (
                                <div
                                    key={company.rank}
                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-colors"
                                    onClick={() => onCompanySelect?.(company)}
                                    data-oid="s_g7rxg"
                                >
                                    <div
                                        className="flex items-start justify-between"
                                        data-oid="ji22lty"
                                    >
                                        <div className="flex-1" data-oid=".27vyjo">
                                            <div
                                                className="flex items-center space-x-3 mb-2"
                                                data-oid="1mo8zx7"
                                            >
                                                <div
                                                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                    data-oid="pszjogt"
                                                >
                                                    {company.rank}
                                                </div>
                                                <h3
                                                    className="text-lg font-semibold text-gray-900 dark:text-white"
                                                    data-oid="w1_ytk0"
                                                >
                                                    {company.name}
                                                </h3>
                                                <span
                                                    className="text-sm text-gray-500 dark:text-gray-400"
                                                    data-oid="_t.s:zy"
                                                >
                                                    #{index + 1} in results
                                                </span>
                                            </div>

                                            <div
                                                className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
                                                data-oid="r8xakp7"
                                            >
                                                <div data-oid="3q:n845">
                                                    <span
                                                        className="text-gray-600 dark:text-gray-400"
                                                        data-oid="h:4:ws4"
                                                    >
                                                        Lokasyon:
                                                    </span>
                                                    <p
                                                        className="font-medium text-gray-900 dark:text-white"
                                                        data-oid="_i4gca6"
                                                    >
                                                        {company.location}
                                                    </p>
                                                </div>
                                                <div data-oid="keystng">
                                                    <span
                                                        className="text-gray-600 dark:text-gray-400"
                                                        data-oid="pgelp_3"
                                                    >
                                                        Uzmanlık:
                                                    </span>
                                                    <p
                                                        className="font-medium text-gray-900 dark:text-white"
                                                        data-oid="1:uxrj4"
                                                    >
                                                        {company.specialty}
                                                    </p>
                                                </div>
                                                <div data-oid="lu-nv8k">
                                                    <span
                                                        className="text-gray-600 dark:text-gray-400"
                                                        data-oid="2y1j:6k"
                                                    >
                                                        Gelir 2024:
                                                    </span>
                                                    <p
                                                        className="font-medium text-gray-900 dark:text-white"
                                                        data-oid="htxilyv"
                                                    >
                                                        €{company.revenue2024}B
                                                    </p>
                                                </div>
                                                <div data-oid="xyy-yhs">
                                                    <span
                                                        className="text-gray-600 dark:text-gray-400"
                                                        data-oid="cwc6xvp"
                                                    >
                                                        Çalışan:
                                                    </span>
                                                    <p
                                                        className="font-medium text-gray-900 dark:text-white"
                                                        data-oid="ty5pynt"
                                                    >
                                                        {company.employees.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                className="mt-3 flex items-center space-x-4"
                                                data-oid="96-6yai"
                                            >
                                                <span
                                                    className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                                                    data-oid="i20klx3"
                                                >
                                                    Pazar Payı: {company.marketShare}%
                                                </span>
                                                {company.revenue2023 > 0 && (
                                                    <span
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                                                        data-oid="z:xf7_s"
                                                    >
                                                        Büyüme: +
                                                        {(
                                                            ((company.revenue2024 -
                                                                company.revenue2023) /
                                                                company.revenue2023) *
                                                            100
                                                        ).toFixed(1)}
                                                        %
                                                    </span>
                                                )}
                                                {(company as any).relevanceScore && (
                                                    <span
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full"
                                                        data-oid="v932r1r"
                                                    >
                                                        Relevance:{' '}
                                                        {Math.round(
                                                            (company as any).relevanceScore,
                                                        )}
                                                        %
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="md6c9pg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid="btc:jnw"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8" data-oid="3-12fwl">
                                <p className="text-gray-500 dark:text-gray-400" data-oid="d7h305-">
                                    Arama kriterlerinize uygun şirket bulunamadı
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                    <div className="space-y-6" data-oid="moxvfwc">
                        {/* Insight Type Filter */}
                        <div className="flex flex-wrap gap-2" data-oid="n95gx3r">
                            {[
                                'all',
                                'trend',
                                'pattern',
                                'anomaly',
                                'correlation',
                                'prediction',
                            ].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedInsightType(type)}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                        selectedInsightType === type
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                    data-oid="fbcri79"
                                >
                                    {type === 'all'
                                        ? 'Tümü'
                                        : type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Insights List */}
                        <div className="space-y-4" data-oid="-dfmu.i">
                            {filteredInsights.length > 0 ? (
                                filteredInsights.map((insight, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                                        data-oid="tncr1t8"
                                    >
                                        <div
                                            className="flex items-start space-x-3"
                                            data-oid="xsn30:."
                                        >
                                            <div
                                                className={`p-2 rounded-lg ${
                                                    insight.type === 'trend'
                                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                                        : insight.type === 'pattern'
                                                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                                                          : insight.type === 'anomaly'
                                                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                                                            : insight.type === 'correlation'
                                                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                                                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                }`}
                                                data-oid=":qk_gc1"
                                            >
                                                {getInsightIcon(insight.type)}
                                            </div>

                                            <div className="flex-1" data-oid="9pzuo69">
                                                <div
                                                    className="flex items-center justify-between mb-2"
                                                    data-oid="4m52lvw"
                                                >
                                                    <h3
                                                        className="font-semibold text-gray-900 dark:text-white"
                                                        data-oid="1ts-oaq"
                                                    >
                                                        {insight.title}
                                                    </h3>
                                                    <div
                                                        className="flex items-center space-x-2 text-sm"
                                                        data-oid="bi.-ggi"
                                                    >
                                                        <span
                                                            className={`font-medium ${getConfidenceColor(insight.confidence)}`}
                                                            data-oid="6alyfiw"
                                                        >
                                                            {Math.round(insight.confidence * 100)}%
                                                            güven
                                                        </span>
                                                        <span
                                                            className="text-gray-500 dark:text-gray-400"
                                                            data-oid="nz9vg8i"
                                                        >
                                                            Relevance:{' '}
                                                            {Math.round(insight.relevance * 100)}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <p
                                                    className="text-gray-700 dark:text-gray-300 mb-3"
                                                    data-oid="sz3.bs1"
                                                >
                                                    {insight.description}
                                                </p>

                                                {insight.data && (
                                                    <div
                                                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                                                        data-oid="ku.5g0f"
                                                    >
                                                        <pre
                                                            className="text-xs text-gray-600 dark:text-gray-300 overflow-x-auto"
                                                            data-oid="cjxhnsi"
                                                        >
                                                            {JSON.stringify(insight.data, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8" data-oid="fhkrx1z">
                                    <p
                                        className="text-gray-500 dark:text-gray-400"
                                        data-oid="u32i-r7"
                                    >
                                        {selectedInsightType === 'all'
                                            ? 'Henüz içgörü bulunamadı'
                                            : `${selectedInsightType} türünde içgörü bulunamadı`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Recommendations Tab */}
                {activeTab === 'recommendations' && (
                    <div className="space-y-4" data-oid="thrk_0m">
                        {results.recommendations.length > 0 ? (
                            results.recommendations.map((recommendation, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                                    data-oid="gb6js4v"
                                >
                                    <div
                                        className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg"
                                        data-oid="diyxm6m"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="bpcf-fx"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                data-oid="nlf4gqw"
                                            />
                                        </svg>
                                    </div>
                                    <div data-oid="v.ge:ir">
                                        <p
                                            className="text-blue-800 dark:text-blue-200 font-medium"
                                            data-oid="xrlgw:d"
                                        >
                                            Öneri #{index + 1}
                                        </p>
                                        <p
                                            className="text-blue-700 dark:text-blue-300 mt-1"
                                            data-oid="l1tdex6"
                                        >
                                            {recommendation}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8" data-oid="s2gq8gp">
                                <p className="text-gray-500 dark:text-gray-400" data-oid="adb82y5">
                                    Henüz öneri bulunamadı
                                </p>
                            </div>
                        )}

                        {/* Related Queries */}
                        {results.relatedQueries.length > 0 && (
                            <div className="mt-8" data-oid="6uye67h">
                                <h3
                                    className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                                    data-oid="pack7to"
                                >
                                    İlgili Arama Önerileri
                                </h3>
                                <div className="flex flex-wrap gap-2" data-oid="bz91:yl">
                                    {results.relatedQueries.map((query, index) => (
                                        <button
                                            key={index}
                                            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            data-oid="4hv7zm5"
                                        >
                                            {query}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Metadata Tab */}
                {activeTab === 'metadata' && (
                    <div className="space-y-6" data-oid="s0elbcm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="bsr:zcb">
                            <div
                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                                data-oid="w39mg.k"
                            >
                                <h3
                                    className="font-semibold text-gray-900 dark:text-white mb-3"
                                    data-oid="ilzpoxj"
                                >
                                    Arama Bilgileri
                                </h3>
                                <div className="space-y-2 text-sm" data-oid="qw9az94">
                                    <div className="flex justify-between" data-oid="2nk4iqk">
                                        <span
                                            className="text-gray-600 dark:text-gray-400"
                                            data-oid="l1lyb.e"
                                        >
                                            Toplam Sonuç:
                                        </span>
                                        <span
                                            className="font-medium text-gray-900 dark:text-white"
                                            data-oid="jyg3dj-"
                                        >
                                            {results.searchMetadata.totalResults}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="lv27pmj">
                                        <span
                                            className="text-gray-600 dark:text-gray-400"
                                            data-oid="-c9xows"
                                        >
                                            Filtrelenmiş:
                                        </span>
                                        <span
                                            className="font-medium text-gray-900 dark:text-white"
                                            data-oid="2.rvco9"
                                        >
                                            {results.searchMetadata.filteredResults}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="n.3mjea">
                                        <span
                                            className="text-gray-600 dark:text-gray-400"
                                            data-oid="bjya:33"
                                        >
                                            Arama Derinliği:
                                        </span>
                                        <span
                                            className="font-medium text-gray-900 dark:text-white"
                                            data-oid="_hdha-."
                                        >
                                            {results.searchMetadata.searchDepth}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid=".tid_st">
                                        <span
                                            className="text-gray-600 dark:text-gray-400"
                                            data-oid="7prl:9v"
                                        >
                                            Veri Kalitesi:
                                        </span>
                                        <span
                                            className="font-medium text-gray-900 dark:text-white"
                                            data-oid="lsney1i"
                                        >
                                            {Math.round(results.searchMetadata.dataQuality * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                                data-oid="liqen8t"
                            >
                                <h3
                                    className="font-semibold text-gray-900 dark:text-white mb-3"
                                    data-oid="bsmwy13"
                                >
                                    AI Modelleri
                                </h3>
                                <div className="space-y-2" data-oid="am2u:oi">
                                    {results.searchMetadata.aiModelsUsed.map((model, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2"
                                            data-oid="4izho__"
                                        >
                                            <div
                                                className="w-2 h-2 bg-green-500 rounded-full"
                                                data-oid="wv-5btm"
                                            ></div>
                                            <span
                                                className="text-sm text-gray-700 dark:text-gray-300"
                                                data-oid="bdoi9pj"
                                            >
                                                {model}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                            data-oid="p-rewok"
                        >
                            <h3
                                className="font-semibold text-gray-900 dark:text-white mb-3"
                                data-oid=":88hhe7"
                            >
                                İşlem Adımları
                            </h3>
                            <div className="space-y-3" data-oid="y1k9e8m">
                                {results.searchMetadata.processingSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3"
                                        data-oid="4r7nlqv"
                                    >
                                        <div
                                            className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold"
                                            data-oid="p8ii-ut"
                                        >
                                            {index + 1}
                                        </div>
                                        <span
                                            className="text-sm text-gray-700 dark:text-gray-300"
                                            data-oid="txyt_ts"
                                        >
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
