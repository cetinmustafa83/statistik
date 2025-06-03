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
        <div className="space-y-6" data-oid="3v7.zy.">
            {/* Key Metrics */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                data-oid="4jol_ly"
            >
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="a956ni:"
                >
                    <div className="flex items-center" data-oid="ez2kilv">
                        <div
                            className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                            data-oid="mqsj.__"
                        >
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="tuz9hws"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    data-oid="e7dr9k_"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid=":1-bl14">
                            <p className="text-sm font-medium text-gray-600" data-oid="b5d411b">
                                Gesamte Suchen
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="5gh5b:9">
                                {analytics.totalSearches}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="wkzk:cw"
                >
                    <div className="flex items-center" data-oid="igv15ch">
                        <div
                            className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                            data-oid="gjud.0b"
                        >
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="shec8v-"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="8z65.3f"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="5_dh757">
                            <p className="text-sm font-medium text-gray-600" data-oid="xsuc1fn">
                                Erfolgsrate
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="9.5cgqy">
                                {analytics.successRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="yso:fmt"
                >
                    <div className="flex items-center" data-oid="b5z4i.b">
                        <div
                            className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                            data-oid="mpon3a9"
                        >
                            <svg
                                className="w-5 h-5 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="d1xg8kw"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="2sfhluk"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="8.aok:a">
                            <p className="text-sm font-medium text-gray-600" data-oid="a4o40mw">
                                Ø Antwortzeit
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="rp813d6">
                                {analytics.averageResponseTime.toFixed(1)}s
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="ett0tmc"
                >
                    <div className="flex items-center" data-oid="1-iobb6">
                        <div
                            className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                            data-oid="ucff2.5"
                        >
                            <svg
                                className="w-5 h-5 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="nuerumt"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    data-oid="x9t05t0"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="rk_0:5j">
                            <p className="text-sm font-medium text-gray-600" data-oid=":kn2rvi">
                                AI Abfragen
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="c0gpnaa">
                                {analytics.totalQueries}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="a2z-ms9">
                {/* Query Trends */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                    data-oid=".f2siv-"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="ojd78tu">
                        Abfrage-Trends (7 Tage)
                    </h3>
                    <div className="space-y-3" data-oid="_s8q4du">
                        {analytics.queryTrends.map((trend, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                                data-oid="031_8lo"
                            >
                                <span className="text-sm text-gray-600" data-oid="-yohe02">
                                    {new Date(trend.date).toLocaleDateString('de-DE', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <div className="flex items-center space-x-2" data-oid="yho3pwl">
                                    <div
                                        className="w-24 bg-gray-200 rounded-full h-2"
                                        data-oid="_e1psn3"
                                    >
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{
                                                width: `${Math.min((trend.count / Math.max(...analytics.queryTrends.map((t) => t.count), 1)) * 100, 100)}%`,
                                            }}
                                            data-oid="wojr9-m"
                                        ></div>
                                    </div>
                                    <span
                                        className="text-sm font-medium text-gray-900 w-8"
                                        data-oid="bklvrio"
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
                    data-oid="t89was5"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="gf62h97">
                        AI-Provider Nutzung
                    </h3>
                    <div className="space-y-3" data-oid="j6dq.0b">
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
                                    data-oid="2kc7g82"
                                >
                                    <div className="flex items-center space-x-2" data-oid="p07cd7n">
                                        <div
                                            className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}
                                            data-oid="l8_mbk7"
                                        ></div>
                                        <span
                                            className="text-sm font-medium text-gray-700 capitalize"
                                            data-oid="7oxj58r"
                                        >
                                            {provider.provider}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="1se-tc5">
                                        <div
                                            className="w-20 bg-gray-200 rounded-full h-2"
                                            data-oid="kisj45x"
                                        >
                                            <div
                                                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                                style={{
                                                    width: `${(provider.count / Math.max(...analytics.providerUsage.map((p) => p.count), 1)) * 100}%`,
                                                }}
                                                data-oid="u9i.lnu"
                                            ></div>
                                        </div>
                                        <span
                                            className="text-sm text-gray-600 w-8"
                                            data-oid="aqu_jye"
                                        >
                                            {provider.count}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {analytics.providerUsage.length === 0 && (
                            <p className="text-sm text-gray-500" data-oid="870njdy">
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
                    data-oid="6gdszyt"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="bg9su5g">
                        Häufigste Suchbegriffe
                    </h3>
                    <div className="flex flex-wrap gap-2" data-oid="a6p9hzx">
                        {analytics.topSearchTerms.map((term, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                data-oid="pzu.k7v"
                            >
                                {term.term}
                                <span
                                    className="ml-1 text-xs bg-blue-200 text-blue-700 rounded-full px-1"
                                    data-oid="_mkaiih"
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
