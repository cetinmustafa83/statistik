'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/database';

interface AnalyticsData {
    totalSearches: number;
    totalQueries: number;
    successRate: number;
    averageResponseTime: number;
    topSearchTerms: { term: string; count: number }[];
    queryTrends: { date: string; count: number }[];
    providerUsage: { provider: string; count: number }[];
}

export function SearchAnalytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalSearches: 0,
        totalQueries: 0,
        successRate: 0,
        averageResponseTime: 0,
        topSearchTerms: [],
        queryTrends: [],
        providerUsage: [],
    });

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = () => {
        try {
            const data = db.getSearchAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    };

    return (
        <div className="space-y-6" data-oid="4hlxr3s">
            {/* Key Metrics */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                data-oid="hvifwq-"
            >
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="lmbsat."
                >
                    <div className="flex items-center" data-oid="135y32o">
                        <div
                            className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                            data-oid="id.hejx"
                        >
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="is58e.3"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    data-oid="4pjq01u"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="xh6a4om">
                            <p className="text-sm font-medium text-gray-600" data-oid="xjej4tz">
                                Gesamte Suchen
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="v6yb7ln">
                                {analytics.totalSearches}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="6t4ts0g"
                >
                    <div className="flex items-center" data-oid="g98lk1d">
                        <div
                            className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                            data-oid="b2w27ky"
                        >
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="o7-sm7v"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="i:1:3e9"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="h1moz5z">
                            <p className="text-sm font-medium text-gray-600" data-oid="e1_dvw-">
                                Erfolgsrate
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="y7ocu91">
                                {analytics.successRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="trzywcc"
                >
                    <div className="flex items-center" data-oid="htg0.ha">
                        <div
                            className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                            data-oid="::dco5c"
                        >
                            <svg
                                className="w-5 h-5 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="ie.6-6n"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="0ff12kr"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="xngwgo6">
                            <p className="text-sm font-medium text-gray-600" data-oid="oqtcf3_">
                                Ø Antwortzeit
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="mau9vc.">
                                {analytics.averageResponseTime.toFixed(1)}s
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="a7s7x3e"
                >
                    <div className="flex items-center" data-oid="5hrwptn">
                        <div
                            className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                            data-oid="qh597_v"
                        >
                            <svg
                                className="w-5 h-5 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="wm8.9e_"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    data-oid="scna-qt"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="_6qzuld">
                            <p className="text-sm font-medium text-gray-600" data-oid="p_:ufp5">
                                AI Abfragen
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="lw51f0k">
                                {analytics.totalQueries}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="ko1e9tt">
                {/* Query Trends */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                    data-oid="rhpd_y-"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="gan.dof">
                        Abfrage-Trends (7 Tage)
                    </h3>
                    <div className="space-y-3" data-oid="0098rha">
                        {analytics.queryTrends.map((trend, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                                data-oid="8_d:ezb"
                            >
                                <span className="text-sm text-gray-600" data-oid="8naffxy">
                                    {new Date(trend.date).toLocaleDateString('de-DE', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <div className="flex items-center space-x-2" data-oid="ptve76u">
                                    <div
                                        className="w-24 bg-gray-200 rounded-full h-2"
                                        data-oid="-3n.dfn"
                                    >
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{
                                                width: `${Math.min((trend.count / Math.max(...analytics.queryTrends.map((t) => t.count), 1)) * 100, 100)}%`,
                                            }}
                                            data-oid=":z41ezt"
                                        ></div>
                                    </div>
                                    <span
                                        className="text-sm font-medium text-gray-900 w-8"
                                        data-oid="i61i:r2"
                                    >
                                        {trend.count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Provider Usage */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                    data-oid="xz9dew6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="dbezpv:">
                        AI-Provider Nutzung
                    </h3>
                    <div className="space-y-3" data-oid=".4363_u">
                        {analytics.providerUsage.map((provider, index) => {
                            const colors = [
                                'bg-blue-500',
                                'bg-green-500',
                                'bg-yellow-500',
                                'bg-purple-500',
                            ];

                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                    data-oid="-.bh46:"
                                >
                                    <div className="flex items-center space-x-2" data-oid=".wnb.fk">
                                        <div
                                            className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}
                                            data-oid="9.frki_"
                                        ></div>
                                        <span
                                            className="text-sm font-medium text-gray-700 capitalize"
                                            data-oid="iyvv95f"
                                        >
                                            {provider.provider}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid=":cocype">
                                        <div
                                            className="w-20 bg-gray-200 rounded-full h-2"
                                            data-oid="5w7r_ny"
                                        >
                                            <div
                                                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                                style={{
                                                    width: `${(provider.count / Math.max(...analytics.providerUsage.map((p) => p.count), 1)) * 100}%`,
                                                }}
                                                data-oid=":0amtvr"
                                            ></div>
                                        </div>
                                        <span
                                            className="text-sm text-gray-600 w-8"
                                            data-oid="-g48pki"
                                        >
                                            {provider.count}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {analytics.providerUsage.length === 0 && (
                            <p className="text-sm text-gray-500" data-oid="d.0:brw">
                                Noch keine Daten verfügbar
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Search Terms */}
            {analytics.topSearchTerms.length > 0 && (
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                    data-oid=":-zdd9a"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="7058wfi">
                        Häufigste Suchbegriffe
                    </h3>
                    <div className="flex flex-wrap gap-2" data-oid="u5l3o4s">
                        {analytics.topSearchTerms.map((term, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                data-oid="8wapdje"
                            >
                                {term.term}
                                <span
                                    className="ml-1 text-xs bg-blue-200 text-blue-700 rounded-full px-1"
                                    data-oid="gl1mrq-"
                                >
                                    {term.count}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
