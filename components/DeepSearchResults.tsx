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
                data-oid="ue_4_f4"
            >
                <div
                    className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
                    data-oid="p60cnxi"
                >
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="abydygh"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            data-oid="osg2982"
                        />
                    </svg>
                </div>
                <h3
                    className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                    data-oid="wqk.-:b"
                >
                    Derin Arama Sonucu Bekleniyor
                </h3>
                <p className="text-gray-600 dark:text-gray-300" data-oid="._q8.4m">
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
                        data-oid="efj8-vn"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            data-oid="p9mtr22"
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
                        data-oid="1cx8v7m"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            data-oid="bfoxbrh"
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
                        data-oid="43a9kp4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            data-oid="8idvle3"
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
                        data-oid="fhimes:"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            data-oid="23k4r--"
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
                        data-oid="ma_zott"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            data-oid="knem7ic"
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
                        data-oid="s8.w-.m"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            data-oid="raeyd1n"
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
            data-oid="mxseoh9"
        >
            {/* Header with Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-600" data-oid=".lxhk0c">
                <div className="px-6 py-4" data-oid="tubc0ju">
                    <div className="flex items-center justify-between mb-4" data-oid="236yb9i">
                        <h2
                            className="text-xl font-bold text-gray-900 dark:text-white"
                            data-oid="ejltq6w"
                        >
                            Derin Arama Sonuçları
                        </h2>
                        <div
                            className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300"
                            data-oid="1jj4u6j"
                        >
                            <span data-oid="s9nq:.0">
                                Güven:{' '}
                                <span
                                    className={getConfidenceColor(results.confidence)}
                                    data-oid=".bv-ggt"
                                >
                                    {Math.round(results.confidence * 100)}%
                                </span>
                            </span>
                            <span data-oid="3k:p89n">Süre: {results.processingTime}ms</span>
                        </div>
                    </div>

                    <nav className="flex space-x-8" data-oid="hngepj8">
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
                                data-oid="jj-veku"
                            >
                                {tab.label}
                                {tab.count !== null && (
                                    <span
                                        className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full"
                                        data-oid="j3xf1a8"
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
            <div className="p-6" data-oid=".mnd5-t">
                {/* Companies Tab */}
                {activeTab === 'companies' && (
                    <div className="space-y-4" data-oid="nta9joi">
                        {results.companies.length > 0 ? (
                            results.companies.map((company, index) => (
                                <div
                                    key={company.rank}
                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-colors"
                                    onClick={() => onCompanySelect?.(company)}
                                    data-oid="y:lyh2y"
                                >
                                    <div
                                        className="flex items-start justify-between"
                                        data-oid="sxmew5y"
                                    >
                                        <div className="flex-1" data-oid="551pftg">
                                            <div
                                                className="flex items-center space-x-3 mb-2"
                                                data-oid="ybqzj1q"
                                            >
                                                <div
                                                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                    data-oid="6dmiqoa"
                                                >
                                                    {company.rank}
                                                </div>
                                                <h3
                                                    className="text-lg font-semibold text-gray-900 dark:text-white"
                                                    data-oid="vez34z."
                                                >
                                                    {company.name}
                                                </h3>
                                                <span
                                                    className="text-sm text-gray-500 dark:text-gray-400"
                                                    data-oid=".2nlctg"
                                                >
                                                    #{index + 1} in results
                                                </span>
                                            </div>

                                            <div
                                                className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
                                                data-oid="t3sf2c7"
                                            >
                                                <div data-oid="w8fl-tw">
                                                    <span
                                                        className="text-gray-600 dark:text-gray-400"
                                                        data-oid="n.8xwwx"
                                                    >
                                                        Lokasyon:
                                                    </span>
                                                    <p
                                                        className="font-medium text-gray-900 dark:text-white"
                                                        data-oid="hdfj8la"
                                                    >
                                                        {company.location}
                                                    </p>
                                                </div>
                                                <div data-oid="xzrxusg">
                                                    <span
                                                        className="text-gray-600 dark:text-gray-400"
                                                        data-oid="c2yf892"
                                                    >
                                                        Uzmanlık:
                                                    </span>
                                                    <p
                                                        className="font-medium text-gray-900 dark:text-white"
                                                        data-oid="q_ug9fi"
                                                    >
                                                        {company.specialty}
                                                    </p>
                                                </div>
                                                <div data-oid="y-.6b:b">
                                                    <span
                                                        className="text-gray-600 dark:text-gray-400"
                                                        data-oid=":ykgdwq"
                                                    >
                                                        Gelir 2024:
                                                    </span>
                                                    <p
                                                        className="font-medium text-gray-900 dark:text-white"
                                                        data-oid="9trmr_8"
                                                    >
                                                        €{company.revenue2024}B
                                                    </p>
                                                </div>
                                                <div data-oid="d_fd_vd">
                                                    <span
                                                        className="text-gray-600 dark:text-gray-400"
                                                        data-oid="k738dnc"
                                                    >
                                                        Çalışan:
                                                    </span>
                                                    <p
                                                        className="font-medium text-gray-900 dark:text-white"
                                                        data-oid="ay-yqv5"
                                                    >
                                                        {company.employees.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                className="mt-3 flex items-center space-x-4"
                                                data-oid="w:q7aoz"
                                            >
                                                <span
                                                    className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                                                    data-oid=":ah9jrl"
                                                >
                                                    Pazar Payı: {company.marketShare}%
                                                </span>
                                                {company.revenue2023 > 0 && (
                                                    <span
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                                                        data-oid="0ldxgo_"
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
                                                        data-oid="mpxvm0i"
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
                                            data-oid="03_vdom"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid="_a2ts6j"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8" data-oid="ci2seub">
                                <p className="text-gray-500 dark:text-gray-400" data-oid="djl355p">
                                    Arama kriterlerinize uygun şirket bulunamadı
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                    <div className="space-y-6" data-oid="5dg9__a">
                        {/* Insight Type Filter */}
                        <div className="flex flex-wrap gap-2" data-oid="6t2bzs-">
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
                                    data-oid="1zl:rlp"
                                >
                                    {type === 'all'
                                        ? 'Tümü'
                                        : type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Insights List */}
                        <div className="space-y-4" data-oid="dotq9pk">
                            {filteredInsights.length > 0 ? (
                                filteredInsights.map((insight, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                                        data-oid="hx.6:mk"
                                    >
                                        <div
                                            className="flex items-start space-x-3"
                                            data-oid="m_x126q"
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
                                                data-oid="_ti2dyu"
                                            >
                                                {getInsightIcon(insight.type)}
                                            </div>

                                            <div className="flex-1" data-oid="o1ancrn">
                                                <div
                                                    className="flex items-center justify-between mb-2"
                                                    data-oid="53vz2qz"
                                                >
                                                    <h3
                                                        className="font-semibold text-gray-900 dark:text-white"
                                                        data-oid="dbxv7ha"
                                                    >
                                                        {insight.title}
                                                    </h3>
                                                    <div
                                                        className="flex items-center space-x-2 text-sm"
                                                        data-oid="qkn9340"
                                                    >
                                                        <span
                                                            className={`font-medium ${getConfidenceColor(insight.confidence)}`}
                                                            data-oid="ibn2inl"
                                                        >
                                                            {Math.round(insight.confidence * 100)}%
                                                            güven
                                                        </span>
                                                        <span
                                                            className="text-gray-500 dark:text-gray-400"
                                                            data-oid="mi96z3u"
                                                        >
                                                            Relevance:{' '}
                                                            {Math.round(insight.relevance * 100)}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <p
                                                    className="text-gray-700 dark:text-gray-300 mb-3"
                                                    data-oid="jcnrl.:"
                                                >
                                                    {insight.description}
                                                </p>

                                                {insight.data && (
                                                    <div
                                                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                                                        data-oid="k8lwahw"
                                                    >
                                                        <pre
                                                            className="text-xs text-gray-600 dark:text-gray-300 overflow-x-auto"
                                                            data-oid="_5k4pcs"
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
                                <div className="text-center py-8" data-oid="9sm1-xj">
                                    <p
                                        className="text-gray-500 dark:text-gray-400"
                                        data-oid="sbebcu-"
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
                    <div className="space-y-4" data-oid="yxn3:.5">
                        {results.recommendations.length > 0 ? (
                            results.recommendations.map((recommendation, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                                    data-oid="m-7s1_t"
                                >
                                    <div
                                        className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg"
                                        data-oid="aj747aq"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="fw51_y2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                data-oid="wdjtm1."
                                            />
                                        </svg>
                                    </div>
                                    <div data-oid="fu-sg8-">
                                        <p
                                            className="text-blue-800 dark:text-blue-200 font-medium"
                                            data-oid="m3falww"
                                        >
                                            Öneri #{index + 1}
                                        </p>
                                        <p
                                            className="text-blue-700 dark:text-blue-300 mt-1"
                                            data-oid="mnzg3nn"
                                        >
                                            {recommendation}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8" data-oid="jfymkc-">
                                <p className="text-gray-500 dark:text-gray-400" data-oid="bhfvoam">
                                    Henüz öneri bulunamadı
                                </p>
                            </div>
                        )}

                        {/* Related Queries */}
                        {results.relatedQueries.length > 0 && (
                            <div className="mt-8" data-oid="4gw-ccv">
                                <h3
                                    className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                                    data-oid="r4_u9em"
                                >
                                    İlgili Arama Önerileri
                                </h3>
                                <div className="flex flex-wrap gap-2" data-oid="9b2jth.">
                                    {results.relatedQueries.map((query, index) => (
                                        <button
                                            key={index}
                                            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            data-oid="dhgu1ga"
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
                    <div className="space-y-6" data-oid="1b-o62j">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="9gzqmeq">
                            <div
                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                                data-oid="csrh9v5"
                            >
                                <h3
                                    className="font-semibold text-gray-900 dark:text-white mb-3"
                                    data-oid="syd-rpz"
                                >
                                    Arama Bilgileri
                                </h3>
                                <div className="space-y-2 text-sm" data-oid="dv6c3uu">
                                    <div className="flex justify-between" data-oid="f9j2x..">
                                        <span
                                            className="text-gray-600 dark:text-gray-400"
                                            data-oid="4ux3egi"
                                        >
                                            Toplam Sonuç:
                                        </span>
                                        <span
                                            className="font-medium text-gray-900 dark:text-white"
                                            data-oid="r.8.rz6"
                                        >
                                            {results.searchMetadata.totalResults}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="d3gb2bk">
                                        <span
                                            className="text-gray-600 dark:text-gray-400"
                                            data-oid="y8g10b:"
                                        >
                                            Filtrelenmiş:
                                        </span>
                                        <span
                                            className="font-medium text-gray-900 dark:text-white"
                                            data-oid="q51mg14"
                                        >
                                            {results.searchMetadata.filteredResults}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="f-1hdqe">
                                        <span
                                            className="text-gray-600 dark:text-gray-400"
                                            data-oid="-kn3d4y"
                                        >
                                            Arama Derinliği:
                                        </span>
                                        <span
                                            className="font-medium text-gray-900 dark:text-white"
                                            data-oid="99_c5bj"
                                        >
                                            {results.searchMetadata.searchDepth}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="zuu.su3">
                                        <span
                                            className="text-gray-600 dark:text-gray-400"
                                            data-oid="_71fdot"
                                        >
                                            Veri Kalitesi:
                                        </span>
                                        <span
                                            className="font-medium text-gray-900 dark:text-white"
                                            data-oid="te2a0fy"
                                        >
                                            {Math.round(results.searchMetadata.dataQuality * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                                data-oid="3:_0iw0"
                            >
                                <h3
                                    className="font-semibold text-gray-900 dark:text-white mb-3"
                                    data-oid="5bditrz"
                                >
                                    AI Modelleri
                                </h3>
                                <div className="space-y-2" data-oid="js44geh">
                                    {results.searchMetadata.aiModelsUsed.map((model, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2"
                                            data-oid="pjww8jp"
                                        >
                                            <div
                                                className="w-2 h-2 bg-green-500 rounded-full"
                                                data-oid="2zckj0y"
                                            ></div>
                                            <span
                                                className="text-sm text-gray-700 dark:text-gray-300"
                                                data-oid="21x861-"
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
                            data-oid="1_7mxct"
                        >
                            <h3
                                className="font-semibold text-gray-900 dark:text-white mb-3"
                                data-oid="tl7-kj7"
                            >
                                İşlem Adımları
                            </h3>
                            <div className="space-y-3" data-oid="yy.9xe8">
                                {results.searchMetadata.processingSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3"
                                        data-oid="d0rf:uj"
                                    >
                                        <div
                                            className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold"
                                            data-oid="dn.ybtx"
                                        >
                                            {index + 1}
                                        </div>
                                        <span
                                            className="text-sm text-gray-700 dark:text-gray-300"
                                            data-oid="uarmios"
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
