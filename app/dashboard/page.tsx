'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, ITCompany } from '../../lib/database';
import { cronService } from '../../lib/cronService';
import { useToast } from '../../lib/toast';
import { toastMessages } from '../../lib/toastHelpers';

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [companies, setCompanies] = useState<ITCompany[]>([]);
    const [isQuerying, setIsQuerying] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [cronStatus, setCronStatus] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();

    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const email = localStorage.getItem('userEmail');

        if (!isLoggedIn) {
            router.push('/');
            return;
        }

        setUserEmail(email || '');

        // Initialize database and load data
        setTimeout(() => {
            loadData();

            // Start cron service
            cronService.start();
            setCronStatus(cronService.isServiceRunning());

            setIsLoading(false);
        }, 100); // Small delay to ensure database is initialized
    }, [router]);

    const loadData = () => {
        try {
            const companiesData = db.getCompanies();
            console.log('Loaded companies from DB:', companiesData);
            setCompanies(companiesData);

            if (companiesData.length > 0) {
                setLastUpdate(companiesData[0].lastUpdated);
            }

            // Check if API settings are configured
            const apiSettings = db.getAPISettings();
            if (!apiSettings) {
                addToast(toastMessages.apiSettingsMissing);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            setCompanies([]);
            addToast(toastMessages.dataLoadError);
        }
    };

    const handleLogout = () => {
        cronService.stop();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    const goToSettings = () => {
        router.push('/settings');
    };

    const handleManualQuery = async () => {
        // Check if API settings are configured before querying
        const apiSettings = db.getAPISettings();
        if (!apiSettings) {
            addToast(toastMessages.apiSettingsMissing);
            return;
        }

        setIsQuerying(true);
        try {
            const result = await cronService.runManualQuery();
            if (result.success) {
                loadData();
                addToast(toastMessages.dataUpdated);
            } else {
                addToast(toastMessages.queryError(result.error));
            }
        } catch (error) {
            addToast(toastMessages.unexpectedError);
        }
        setIsQuerying(false);
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="h6h6sj2"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="1ag0kw9"
                ></div>
            </div>
        );
    }

    const hasData = companies.length > 0;

    return (
        <div className="min-h-screen bg-gray-50" data-oid="4:h9zg7">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="9j0.jbs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="m:us8gy">
                    <div className="flex justify-between items-center py-4" data-oid="ym1qc4l">
                        <div className="flex items-center space-x-3" data-oid="-ld8f4e">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="6an6b.d"
                            >
                                <span className="text-white font-bold text-lg" data-oid="aoojo-v">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="-r7omo.">
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="t4hohtu">
                            <button
                                onClick={() => router.push('/ai-search')}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="AI Search"
                                data-oid="3xb-olm"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="dhn5ecs"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        data-oid="vc8zeuz"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={goToSettings}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="Einstellungen"
                                data-oid="-hj7jp-"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="f:7lgx."
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        data-oid="p-txp6."
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        data-oid="js7dlo0"
                                    />
                                </svg>
                            </button>
                            <span className="text-gray-600" data-oid="wj.jta9">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="r-zvtzs"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="gm1l_si">
                {/* Header */}
                <div className="mb-8" data-oid="-m263n.">
                    <div className="flex justify-between items-center" data-oid="iydj:a6">
                        <div data-oid="4bffnzn">
                            <h2
                                className="text-3xl font-bold text-gray-900 mb-2"
                                data-oid="7:4qkl4"
                            >
                                Statistik
                            </h2>
                            <p className="text-gray-600" data-oid="s7u9och">
                                {hasData
                                    ? `Letzte Aktualisierung: ${lastUpdate?.toLocaleString('de-DE')} (${companies.length} Unternehmen)`
                                    : 'Keine Daten verfügbar - Bitte konfigurieren Sie zuerst die AI-Einstellungen'}
                            </p>
                            {/* Debug Info */}
                            <p className="text-xs text-gray-400 mt-1" data-oid="cjv4uix">
                                Debug: DB Status - Companies: {companies.length}, Settings:{' '}
                                {db.getAPISettings() ? 'Konfiguriert' : 'Nicht konfiguriert'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4" data-oid="hc:6ast">
                            <div className="flex items-center space-x-2" data-oid="fk.90_1">
                                <div
                                    className={`w-3 h-3 rounded-full ${cronStatus ? 'bg-green-500' : 'bg-red-500'}`}
                                    data-oid="_squ6pl"
                                ></div>
                                <span className="text-sm text-gray-600" data-oid="755rm71">
                                    Cron: {cronStatus ? 'Aktiv' : 'Inaktiv'}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    console.log('Current companies:', companies);
                                    console.log('DB has data:', db.hasCompanyData());
                                    console.log('API settings:', db.getAPISettings());
                                }}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                                data-oid="ihza3j7"
                            >
                                Debug
                            </button>
                            <button
                                onClick={handleManualQuery}
                                disabled={isQuerying}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="8d278tz"
                            >
                                {isQuerying ? (
                                    <div className="flex items-center" data-oid="cupputr">
                                        <div
                                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                            data-oid="i81wige"
                                        ></div>
                                        Laden...
                                    </div>
                                ) : (
                                    'Daten aktualisieren'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {!hasData ? (
                    /* No Data State */
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
                        data-oid="68s0y61"
                    >
                        <div
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="0ebzu-z"
                        >
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="vucd83d"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    data-oid="svus3a:"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="oy.m22k">
                            Keine Daten verfügbar
                        </h3>
                        <p className="text-gray-600 mb-6" data-oid="yyn5v0r">
                            Um IT-Dienstleister Daten anzuzeigen, müssen Sie zuerst Ihre
                            AI-Einstellungen konfigurieren.
                        </p>
                        <div className="space-y-3" data-oid="2zle3_j">
                            <button
                                onClick={goToSettings}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                data-oid="-su9y.y"
                            >
                                Zu den Einstellungen
                            </button>
                            <p className="text-sm text-gray-500" data-oid="qnp9qpr">
                                Oder klicken Sie auf "Daten aktualisieren" nachdem Sie die
                                API-Einstellungen konfiguriert haben.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Data Display */
                    <>
                        {/* Revenue Chart */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
                            data-oid="e:7.utv"
                        >
                            <h3
                                className="text-xl font-semibold text-gray-900 mb-6"
                                data-oid="azqxx_s"
                            >
                                Umsatzentwicklung (Milliarden €)
                            </h3>
                            <div className="space-y-4" data-oid="tufmcdu">
                                {companies.slice(0, 5).map((company) => (
                                    <div
                                        key={company.rank}
                                        className="flex items-center space-x-4"
                                        data-oid="0-a_cu_"
                                    >
                                        <div
                                            className="w-32 text-sm font-medium text-gray-700 truncate"
                                            data-oid="h:i:-5f"
                                        >
                                            {company.name}
                                        </div>
                                        <div
                                            className="flex-1 flex items-center space-x-2"
                                            data-oid="at032pg"
                                        >
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                                data-oid="wr-o0lo"
                                            >
                                                <div
                                                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.min((company.revenue2023 / 35) * 100, 100)}%`,
                                                    }}
                                                    data-oid="781:0rh"
                                                >
                                                    <span
                                                        className="text-xs text-white font-medium"
                                                        data-oid="k1e3cuw"
                                                    >
                                                        2023: €{company.revenue2023}B
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                                data-oid="1413iov"
                                            >
                                                <div
                                                    className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.min((company.revenue2024 / 35) * 100, 100)}%`,
                                                    }}
                                                    data-oid="kfp1:nl"
                                                >
                                                    <span
                                                        className="text-xs text-white font-medium"
                                                        data-oid="0cxci8l"
                                                    >
                                                        2024: €{company.revenue2024}B
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="w-16 text-sm font-medium text-green-600"
                                                data-oid="d21zm3-"
                                            >
                                                +
                                                {company.revenue2023 > 0
                                                    ? (
                                                          ((company.revenue2024 -
                                                              company.revenue2023) /
                                                              company.revenue2023) *
                                                          100
                                                      ).toFixed(1)
                                                    : '0'}
                                                %
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Companies List */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8"
                            data-oid="zx3wg_q"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="-ndnjue">
                                <h3
                                    className="text-xl font-semibold text-gray-900"
                                    data-oid="q1aoen_"
                                >
                                    Vollständige Rangliste
                                </h3>
                            </div>
                            <div className="overflow-x-auto" data-oid="pezpadx">
                                <table className="w-full" data-oid="o4u0gow">
                                    <thead className="bg-gray-50" data-oid="ner:5a4">
                                        <tr data-oid="1gvtckn">
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="94eak2p"
                                            >
                                                Rang
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="rojqnmt"
                                            >
                                                Unternehmen
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="ro_zdvf"
                                            >
                                                Standort
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="g0o48u7"
                                            >
                                                Spezialisierung
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="wi3sy74"
                                            >
                                                Umsatz 2024
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="7gah_.5"
                                            >
                                                Mitarbeiter
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="5sb9jv."
                                            >
                                                Marktanteil
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-gray-200"
                                        data-oid="uew35h2"
                                    >
                                        {companies.map((company) => (
                                            <tr
                                                key={company.rank}
                                                className="hover:bg-gray-50"
                                                data-oid="941-h-5"
                                            >
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="a2ql-pa"
                                                >
                                                    <div
                                                        className="flex items-center"
                                                        data-oid="2irq8rp"
                                                    >
                                                        <div
                                                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                            data-oid="p03d3r2"
                                                        >
                                                            {company.rank}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="sjrut_x"
                                                >
                                                    <div
                                                        className="text-sm font-medium text-gray-900"
                                                        data-oid="9kxuw8w"
                                                    >
                                                        {company.name}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="gm.4c82"
                                                >
                                                    <div
                                                        className="text-sm text-gray-500"
                                                        data-oid="dnf3xna"
                                                    >
                                                        {company.location}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="9mlx-lw"
                                                >
                                                    <span
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                        data-oid="1ln8etk"
                                                    >
                                                        {company.specialty}
                                                    </span>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="rgxw4_j"
                                                >
                                                    <div
                                                        className="text-sm font-medium text-gray-900"
                                                        data-oid="4jmb8p:"
                                                    >
                                                        €{company.revenue2024}B
                                                    </div>
                                                    <div
                                                        className="text-xs text-green-600"
                                                        data-oid="_u-1a1p"
                                                    >
                                                        +
                                                        {company.revenue2023 > 0
                                                            ? (
                                                                  ((company.revenue2024 -
                                                                      company.revenue2023) /
                                                                      company.revenue2023) *
                                                                  100
                                                              ).toFixed(1)
                                                            : '0'}
                                                        % vs 2023
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="q8xbfbw"
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid="92seoti"
                                                    >
                                                        {company.employees.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="fnjalvu"
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid="v:r84uj"
                                                    >
                                                        {company.marketShare}%
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Market Share and Growth Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="r1zs-22">
                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                data-oid="2e9jna4"
                            >
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-6"
                                    data-oid="ohjfmbo"
                                >
                                    Marktanteil Verteilung
                                </h3>
                                <div className="space-y-3" data-oid="x20buem">
                                    {companies.slice(0, 5).map((company, index) => {
                                        const colors = [
                                            'bg-blue-500',
                                            'bg-green-500',
                                            'bg-yellow-500',
                                            'bg-purple-500',
                                            'bg-red-500',
                                        ];

                                        return (
                                            <div
                                                key={company.rank}
                                                className="flex items-center space-x-3"
                                                data-oid=".dx7-yp"
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded ${colors[index]}`}
                                                    data-oid="_z4kiwp"
                                                ></div>
                                                <div
                                                    className="flex-1 flex justify-between"
                                                    data-oid="p:8jdcp"
                                                >
                                                    <span
                                                        className="text-sm font-medium text-gray-700"
                                                        data-oid="uciwnai"
                                                    >
                                                        {company.name}
                                                    </span>
                                                    <span
                                                        className="text-sm text-gray-500"
                                                        data-oid="1o6z8jl"
                                                    >
                                                        {company.marketShare}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="flex items-center space-x-3" data-oid="c3-h83g">
                                        <div
                                            className="w-4 h-4 rounded bg-gray-400"
                                            data-oid="jhiar8r"
                                        ></div>
                                        <div
                                            className="flex-1 flex justify-between"
                                            data-oid="0qviykd"
                                        >
                                            <span
                                                className="text-sm font-medium text-gray-700"
                                                data-oid="h1yqd5m"
                                            >
                                                Andere
                                            </span>
                                            <span
                                                className="text-sm text-gray-500"
                                                data-oid="-yjny3w"
                                            >
                                                {(
                                                    100 -
                                                    companies
                                                        .slice(0, 5)
                                                        .reduce(
                                                            (sum, company) =>
                                                                sum + company.marketShare,
                                                            0,
                                                        )
                                                ).toFixed(1)}
                                                %
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                data-oid="-dbj355"
                            >
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-6"
                                    data-oid="763a2ba"
                                >
                                    Wachstumstrends 2023-2024
                                </h3>
                                <div className="space-y-4" data-oid="mi34uhx">
                                    {companies.slice(0, 5).map((company) => {
                                        const growth =
                                            company.revenue2023 > 0
                                                ? ((company.revenue2024 - company.revenue2023) /
                                                      company.revenue2023) *
                                                  100
                                                : 0;
                                        return (
                                            <div
                                                key={company.rank}
                                                className="flex items-center justify-between"
                                                data-oid="rq6641i"
                                            >
                                                <span
                                                    className="text-sm font-medium text-gray-700"
                                                    data-oid="_t.c9nl"
                                                >
                                                    {company.name}
                                                </span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid=".p2ybxl"
                                                >
                                                    <div
                                                        className="w-20 bg-gray-200 rounded-full h-2"
                                                        data-oid=":5yvanw"
                                                    >
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${Math.min(Math.max(growth * 5, 0), 100)}%`,
                                                            }}
                                                            data-oid="pwtmxy."
                                                        ></div>
                                                    </div>
                                                    <span
                                                        className="text-sm font-medium text-green-600"
                                                        data-oid="srilrmb"
                                                    >
                                                        +{growth.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
