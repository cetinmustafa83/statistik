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
        <div className="space-y-6" data-oid="l0spwj7">
            {/* Key Metrics */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                data-oid="f.frqsq"
            >
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="0-0ec:g"
                >
                    <div className="flex items-center" data-oid="4goosh7">
                        <div
                            className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                            data-oid="3sbt:go"
                        >
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="zmk10tl"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    data-oid="r-ctwvj"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="3bh:krt">
                            <p className="text-sm font-medium text-gray-600" data-oid=":x33:u-">
                                Gesamte Suchen
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="e6whnod">
                                {analytics.totalSearches}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="160oe4:"
                >
                    <div className="flex items-center" data-oid="ojl.mgi">
                        <div
                            className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                            data-oid="hxc.4kb"
                        >
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="k7zsray"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="1c2v:-6"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="h2.1p2u">
                            <p className="text-sm font-medium text-gray-600" data-oid="1cs4szs">
                                Erfolgsrate
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="lqi:s58">
                                {analytics.successRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="s71b0t0"
                >
                    <div className="flex items-center" data-oid="2s4o5z4">
                        <div
                            className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                            data-oid="4btz9ds"
                        >
                            <svg
                                className="w-5 h-5 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="yzwt8eu"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="qs8f9k."
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="qtofl7.">
                            <p className="text-sm font-medium text-gray-600" data-oid="dewyltn">
                                Ø Antwortzeit
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="rgyhse6">
                                {analytics.averageResponseTime.toFixed(1)}s
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                    data-oid="e1rf.df"
                >
                    <div className="flex items-center" data-oid="xq4yqp-">
                        <div
                            className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                            data-oid=":5c0pex"
                        >
                            <svg
                                className="w-5 h-5 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="s2ukflo"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    data-oid="xl-.n3c"
                                />
                            </svg>
                        </div>
                        <div className="ml-3" data-oid="gbcr3s5">
                            <p className="text-sm font-medium text-gray-600" data-oid="9.5rtkq">
                                AI Abfragen
                            </p>
                            <p className="text-xl font-bold text-gray-900" data-oid="34.stoe">
                                {analytics.totalQueries}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid=":4u9unu">
                {/* Query Trends */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                    data-oid="uzhfpnt"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="h61mo98">
                        Abfrage-Trends (7 Tage)
                    </h3>
                    <div className="space-y-3" data-oid="14dp:.q">
                        {analytics.queryTrends.map((trend, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                                data-oid="xmpms39"
                            >
                                <span className="text-sm text-gray-600" data-oid="mle7jx6">
                                    {new Date(trend.date).toLocaleDateString('de-DE', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <div className="flex items-center space-x-2" data-oid="cc7w_3b">
                                    <div
                                        className="w-24 bg-gray-200 rounded-full h-2"
                                        data-oid="lriwp7v"
                                    >
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{
                                                width: `${Math.min((trend.count / Math.max(...analytics.queryTrends.map((t) => t.count), 1)) * 100, 100)}%`,
                                            }}
                                            data-oid="ni63nhe"
                                        ></div>
                                    </div>
                                    <span
                                        className="text-sm font-medium text-gray-900 w-8"
                                        data-oid="--zy6j:"
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
                    data-oid="eivot77"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="l32qbxs">
                        AI-Provider Nutzung
                    </h3>
                    <div className="space-y-3" data-oid="s4vp:f2">
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
                                    data-oid="cd26blw"
                                >
                                    <div className="flex items-center space-x-2" data-oid="ga1ye1n">
                                        <div
                                            className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}
                                            data-oid="_x3ewk1"
                                        ></div>
                                        <span
                                            className="text-sm font-medium text-gray-700 capitalize"
                                            data-oid="t2ya5ka"
                                        >
                                            {provider.provider}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="rd496rq">
                                        <div
                                            className="w-20 bg-gray-200 rounded-full h-2"
                                            data-oid=":2eg_xm"
                                        >
                                            <div
                                                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                                style={{
                                                    width: `${(provider.count / Math.max(...analytics.providerUsage.map((p) => p.count), 1)) * 100}%`,
                                                }}
                                                data-oid="as0avee"
                                            ></div>
                                        </div>
                                        <span
                                            className="text-sm text-gray-600 w-8"
                                            data-oid="73_06h2"
                                        >
                                            {provider.count}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {analytics.providerUsage.length === 0 && (
                            <p className="text-sm text-gray-500" data-oid="86yb8j5">
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
                    data-oid="--i77ad"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="_.72ejf">
                        Häufigste Suchbegriffe
                    </h3>
                    <div className="flex flex-wrap gap-2" data-oid="fx-1_-6">
                        {analytics.topSearchTerms.map((term, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                data-oid="l0g.z0d"
                            >
                                {term.term}
                                <span
                                    className="ml-1 text-xs bg-blue-200 text-blue-700 rounded-full px-1"
                                    data-oid=":gccngi"
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
