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
        <div className="space-y-6" data-oid="ij-8hx7">
            {/* Key Metrics */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                data-oid="d77ygdm"
            >
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="8y-uy19"
                >
                    <div className="flex items-center" data-oid="l-24o53">
                        <div
                            className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                            data-oid="arkxv95"
                        >
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="buzulc5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    data-oid="1x7e1wn"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="m78d21:">
                            <p className="text-sm font-medium text-gray-600" data-oid="3k34uu1">
                                Gesamte Suchen
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="1aaxu:l">
                                {analytics.totalSearches}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="xh-shjj"
                >
                    <div className="flex items-center" data-oid="q-u60ij">
                        <div
                            className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                            data-oid="4717ov9"
                        >
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="mdvylf9"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="d.83ip7"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="muq3t94">
                            <p className="text-sm font-medium text-gray-600" data-oid=".ptkx7w">
                                Erfolgsrate
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="5j:8frj">
                                {analytics.successRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="8fo7r.x"
                >
                    <div className="flex items-center" data-oid="nql9i8h">
                        <div
                            className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                            data-oid="3gee6be"
                        >
                            <svg
                                className="w-5 h-5 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="m0j5hx7"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="72bj5y7"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="o:h1bz_">
                            <p className="text-sm font-medium text-gray-600" data-oid="y7wlw_h">
                                Ø Antwortzeit
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="kjqf32_">
                                {analytics.averageResponseTime.toFixed(1)}s
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="jx21ujy"
                >
                    <div className="flex items-center" data-oid="txwvt23">
                        <div
                            className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                            data-oid="988z-da"
                        >
                            <svg
                                className="w-5 h-5 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="6qcp_d:"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    data-oid="y3-i7lx"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="7qw4_a-">
                            <p className="text-sm font-medium text-gray-600" data-oid="7t5ytp:">
                                AI Abfragen
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="z_waxzt">
                                {analytics.totalQueries}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="ahibmbp">
                {/* Query Trends */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                    data-oid="lz2wasc"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="fz-z62p">
                        Abfrage-Trends (7 Tage)
                    </h3>
                    <div className="space-y-3" data-oid="geb9ml6">
                        {analytics.queryTrends.map((trend, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                                data-oid="x-eixt_"
                            >
                                <span className="text-sm text-gray-600" data-oid="01b-osq">
                                    {new Date(trend.date).toLocaleDateString('de-DE', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <div className="flex items-center space-x-2" data-oid="oidx2-u">
                                    <div
                                        className="w-24 bg-gray-200 rounded-full h-2"
                                        data-oid="_rl5jqd"
                                    >
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{
                                                width: `${Math.min((trend.count / Math.max(...analytics.queryTrends.map((t) => t.count), 1)) * 100, 100)}%`,
                                            }}
                                            data-oid="dj:gbhh"
                                        ></div>
                                    </div>
                                    <span
                                        className="text-sm font-medium text-gray-900 w-8"
                                        data-oid="hlwoo-l"
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
                    data-oid="l6k4po7"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="43liwtz">
                        AI-Provider Nutzung
                    </h3>
                    <div className="space-y-3" data-oid="vef_05c">
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
                                    data-oid="6z..ynr"
                                >
                                    <div className="flex items-center space-x-2" data-oid="9hmzo7:">
                                        <div
                                            className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}
                                            data-oid="75ndwqg"
                                        ></div>
                                        <span
                                            className="text-sm font-medium text-gray-700 capitalize"
                                            data-oid="g_cqucy"
                                        >
                                            {provider.provider}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="zy6.fu6">
                                        <div
                                            className="w-20 bg-gray-200 rounded-full h-2"
                                            data-oid="8ztub51"
                                        >
                                            <div
                                                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                                style={{
                                                    width: `${(provider.count / Math.max(...analytics.providerUsage.map((p) => p.count), 1)) * 100}%`,
                                                }}
                                                data-oid="m9u_3n4"
                                            ></div>
                                        </div>
                                        <span
                                            className="text-sm text-gray-600 w-8"
                                            data-oid="n81.esd"
                                        >
                                            {provider.count}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {analytics.providerUsage.length === 0 && (
                            <p className="text-sm text-gray-500" data-oid=":7hgcsv">
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
                    data-oid="lfqtzkl"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="n8ujnt9">
                        Häufigste Suchbegriffe
                    </h3>
                    <div className="flex flex-wrap gap-2" data-oid="d8x.mh8">
                        {analytics.topSearchTerms.map((term, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                data-oid="g.mmdb9"
                            >
                                {term.term}
                                <span
                                    className="ml-1 text-xs bg-blue-200 text-blue-700 rounded-full px-1"
                                    data-oid="e7m_e8j"
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
