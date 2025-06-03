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
        <div className="space-y-6" data-oid="88aeofu">
            {/* Key Metrics */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                data-oid="11-vxkg"
            >
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="-oh7tbp"
                >
                    <div className="flex items-center" data-oid="342znns">
                        <div
                            className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                            data-oid="jayzqzz"
                        >
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="3u2s1xz"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    data-oid="_ede713"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="r2xth4h">
                            <p className="text-sm font-medium text-gray-600" data-oid=".c.n39v">
                                Gesamte Suchen
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="e.uv_q.">
                                {analytics.totalSearches}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid=".sbs-cq"
                >
                    <div className="flex items-center" data-oid="7jx-s6.">
                        <div
                            className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                            data-oid="axo4p4r"
                        >
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="uke9jnd"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="g3gf5y-"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="6j5nurr">
                            <p className="text-sm font-medium text-gray-600" data-oid="yyuyb_i">
                                Erfolgsrate
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="tx54w7m">
                                {analytics.successRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="tf:3n-b"
                >
                    <div className="flex items-center" data-oid="cbe0fwk">
                        <div
                            className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                            data-oid="yhkjgi:"
                        >
                            <svg
                                className="w-5 h-5 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="cvuo.:q"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="..d9f3d"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="g:4n-nh">
                            <p className="text-sm font-medium text-gray-600" data-oid="iqw_64a">
                                Ø Antwortzeit
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="67y_-:j">
                                {analytics.averageResponseTime.toFixed(1)}s
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid=":id1tbn"
                >
                    <div className="flex items-center" data-oid="yq_4wkl">
                        <div
                            className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                            data-oid="1mf4pq-"
                        >
                            <svg
                                className="w-5 h-5 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid=".l84ygd"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    data-oid=".4b46o0"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="a.pjbev">
                            <p className="text-sm font-medium text-gray-600" data-oid=".o0g1oh">
                                AI Abfragen
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="9fx9f0n">
                                {analytics.totalQueries}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="hv_2qbv">
                {/* Query Trends */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                    data-oid="q7gwr86"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="ue4cz15">
                        Abfrage-Trends (7 Tage)
                    </h3>
                    <div className="space-y-3" data-oid="px83q8e">
                        {analytics.queryTrends.map((trend, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                                data-oid="vffz80o"
                            >
                                <span className="text-sm text-gray-600" data-oid="i2ma9c.">
                                    {new Date(trend.date).toLocaleDateString('de-DE', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <div className="flex items-center space-x-2" data-oid="408p--c">
                                    <div
                                        className="w-24 bg-gray-200 rounded-full h-2"
                                        data-oid="q7eumkz"
                                    >
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{
                                                width: `${Math.min((trend.count / Math.max(...analytics.queryTrends.map((t) => t.count), 1)) * 100, 100)}%`,
                                            }}
                                            data-oid="3oy_fxx"
                                        ></div>
                                    </div>
                                    <span
                                        className="text-sm font-medium text-gray-900 w-8"
                                        data-oid="9p08.50"
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
                    data-oid="6u:gl12"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="46:kn:q">
                        AI-Provider Nutzung
                    </h3>
                    <div className="space-y-3" data-oid="g6j.gl1">
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
                                    data-oid="dcleni9"
                                >
                                    <div className="flex items-center space-x-2" data-oid="70od085">
                                        <div
                                            className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}
                                            data-oid="9l5nsi-"
                                        ></div>
                                        <span
                                            className="text-sm font-medium text-gray-700 capitalize"
                                            data-oid="6qxiyqz"
                                        >
                                            {provider.provider}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="p:u6yh8">
                                        <div
                                            className="w-20 bg-gray-200 rounded-full h-2"
                                            data-oid="f19t_yf"
                                        >
                                            <div
                                                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                                style={{
                                                    width: `${(provider.count / Math.max(...analytics.providerUsage.map((p) => p.count), 1)) * 100}%`,
                                                }}
                                                data-oid="eeg-w2y"
                                            ></div>
                                        </div>
                                        <span
                                            className="text-sm text-gray-600 w-8"
                                            data-oid="azlnmr8"
                                        >
                                            {provider.count}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {analytics.providerUsage.length === 0 && (
                            <p className="text-sm text-gray-500" data-oid="rqf5pkl">
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
                    data-oid="j90jw6w"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="g0j3ncj">
                        Häufigste Suchbegriffe
                    </h3>
                    <div className="flex flex-wrap gap-2" data-oid="pj4grwl">
                        {analytics.topSearchTerms.map((term, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                data-oid="nl-.17w"
                            >
                                {term.term}
                                <span
                                    className="ml-1 text-xs bg-blue-200 text-blue-700 rounded-full px-1"
                                    data-oid="txvh0uj"
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
