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
                data-oid="0:u:4u."
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="vynkr8h"
                ></div>
            </div>
        );
    }

    const hasData = companies.length > 0;

    return (
        <div className="min-h-screen bg-gray-50" data-oid="kjobclz">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="o5xd0tc">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="nj7jact">
                    <div className="flex justify-between items-center py-4" data-oid="59_2voe">
                        <div className="flex items-center space-x-3" data-oid="pagl4a:">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="nyh4_09"
                            >
                                <span className="text-white font-bold text-lg" data-oid="8dbni_7">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="uwgcg_3">
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="ztz9yqi">
                            <button
                                onClick={() => router.push('/ai-search')}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="AI Search"
                                data-oid=".jem9n4"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="lh0w.12"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        data-oid="us2cphl"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={goToSettings}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="Einstellungen"
                                data-oid="ujz2u.4"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="uha57rf"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        data-oid="1go:0bj"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        data-oid="5zsizc1"
                                    />
                                </svg>
                            </button>
                            <span className="text-gray-600" data-oid="k1o6z7f">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="haedb2a"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="dx.2nc4">
                {/* Header */}
                <div className="mb-8" data-oid="78x1hvw">
                    <div className="flex justify-between items-center" data-oid="kr6rlul">
                        <div data-oid="gfc1bw7">
                            <h2
                                className="text-3xl font-bold text-gray-900 mb-2"
                                data-oid="2_e:kgh"
                            >
                                Statistik
                            </h2>
                            <p className="text-gray-600" data-oid="pxtnqd2">
                                {hasData
                                    ? `Letzte Aktualisierung: ${lastUpdate?.toLocaleString('de-DE')} (${companies.length} Unternehmen)`
                                    : 'Keine Daten verfügbar - Bitte konfigurieren Sie zuerst die AI-Einstellungen'}
                            </p>
                            {/* Debug Info */}
                            <p className="text-xs text-gray-400 mt-1" data-oid="zjmdehj">
                                Debug: DB Status - Companies: {companies.length}, Settings:{' '}
                                {db.getAPISettings() ? 'Konfiguriert' : 'Nicht konfiguriert'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4" data-oid="t3j2sva">
                            <div className="flex items-center space-x-2" data-oid="2id1fqb">
                                <div
                                    className={`w-3 h-3 rounded-full ${cronStatus ? 'bg-green-500' : 'bg-red-500'}`}
                                    data-oid="lp9yzom"
                                ></div>
                                <span className="text-sm text-gray-600" data-oid="wsp95dx">
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
                                data-oid="fi9cq9x"
                            >
                                Debug
                            </button>
                            <button
                                onClick={handleManualQuery}
                                disabled={isQuerying}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="jrfexa_"
                            >
                                {isQuerying ? (
                                    <div className="flex items-center" data-oid="joha4uh">
                                        <div
                                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                            data-oid="zwlu:9g"
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
                        data-oid="er8m.kw"
                    >
                        <div
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="h1ua5a3"
                        >
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="g5:h.jb"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    data-oid="4-1ml-v"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="9wx2vei">
                            Keine Daten verfügbar
                        </h3>
                        <p className="text-gray-600 mb-6" data-oid="2b.l73_">
                            Um IT-Dienstleister Daten anzuzeigen, müssen Sie zuerst Ihre
                            AI-Einstellungen konfigurieren.
                        </p>
                        <div className="space-y-3" data-oid="c7vv-fo">
                            <button
                                onClick={goToSettings}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                data-oid="fez8.x2"
                            >
                                Zu den Einstellungen
                            </button>
                            <p className="text-sm text-gray-500" data-oid="g-s32on">
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
                            data-oid="w.93s2o"
                        >
                            <h3
                                className="text-xl font-semibold text-gray-900 mb-6"
                                data-oid="7bp4a63"
                            >
                                Umsatzentwicklung (Milliarden €)
                            </h3>
                            <div className="space-y-4" data-oid="zrglylv">
                                {companies.slice(0, 5).map((company) => (
                                    <div
                                        key={company.rank}
                                        className="flex items-center space-x-4"
                                        data-oid="oieq4w8"
                                    >
                                        <div
                                            className="w-32 text-sm font-medium text-gray-700 truncate"
                                            data-oid="4qee4:-"
                                        >
                                            {company.name}
                                        </div>
                                        <div
                                            className="flex-1 flex items-center space-x-2"
                                            data-oid="trk3fi7"
                                        >
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                                data-oid="cce.iml"
                                            >
                                                <div
                                                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.min((company.revenue2023 / 35) * 100, 100)}%`,
                                                    }}
                                                    data-oid="khj.v_q"
                                                >
                                                    <span
                                                        className="text-xs text-white font-medium"
                                                        data-oid="mm6j9dd"
                                                    >
                                                        2023: €{company.revenue2023}B
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                                data-oid="4f3eqnu"
                                            >
                                                <div
                                                    className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.min((company.revenue2024 / 35) * 100, 100)}%`,
                                                    }}
                                                    data-oid="bx4f2my"
                                                >
                                                    <span
                                                        className="text-xs text-white font-medium"
                                                        data-oid="2jgndgm"
                                                    >
                                                        2024: €{company.revenue2024}B
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="w-16 text-sm font-medium text-green-600"
                                                data-oid="h_flmhw"
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
                            data-oid="kh7_s07"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="s7h8pis">
                                <h3
                                    className="text-xl font-semibold text-gray-900"
                                    data-oid="8qlvt_1"
                                >
                                    Vollständige Rangliste
                                </h3>
                            </div>
                            <div className="overflow-x-auto" data-oid="9u_mnb3">
                                <table className="w-full" data-oid="qtaf_:-">
                                    <thead className="bg-gray-50" data-oid="cqud9ga">
                                        <tr data-oid=".repuv6">
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="_-x3av_"
                                            >
                                                Rang
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="r9oppnf"
                                            >
                                                Unternehmen
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="xan4rww"
                                            >
                                                Standort
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="xeff-9a"
                                            >
                                                Spezialisierung
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="8ouew46"
                                            >
                                                Umsatz 2024
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="u-m9se5"
                                            >
                                                Mitarbeiter
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="bucrtqc"
                                            >
                                                Marktanteil
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-gray-200"
                                        data-oid="e31ole0"
                                    >
                                        {companies.map((company) => (
                                            <tr
                                                key={company.rank}
                                                className="hover:bg-gray-50"
                                                data-oid="77ubm3o"
                                            >
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="-.ik_12"
                                                >
                                                    <div
                                                        className="flex items-center"
                                                        data-oid="bh35zuy"
                                                    >
                                                        <div
                                                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                            data-oid="smr7ahk"
                                                        >
                                                            {company.rank}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="86e447i"
                                                >
                                                    <div
                                                        className="text-sm font-medium text-gray-900"
                                                        data-oid="v7eqr_2"
                                                    >
                                                        {company.name}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="6uiu2lj"
                                                >
                                                    <div
                                                        className="text-sm text-gray-500"
                                                        data-oid="uyhvhjz"
                                                    >
                                                        {company.location}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="7nh.r50"
                                                >
                                                    <span
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                        data-oid="plos26z"
                                                    >
                                                        {company.specialty}
                                                    </span>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="o_-8ozq"
                                                >
                                                    <div
                                                        className="text-sm font-medium text-gray-900"
                                                        data-oid="m7u8f51"
                                                    >
                                                        €{company.revenue2024}B
                                                    </div>
                                                    <div
                                                        className="text-xs text-green-600"
                                                        data-oid="fk_doq-"
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
                                                    data-oid="0cqja_t"
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid=":08577i"
                                                    >
                                                        {company.employees.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="xjqmfb."
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid="cbxzij."
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="-52o_v1">
                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                data-oid="xfdwml3"
                            >
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-6"
                                    data-oid="w-8rfm-"
                                >
                                    Marktanteil Verteilung
                                </h3>
                                <div className="space-y-3" data-oid="vsg-w99">
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
                                                data-oid="6yu9g6."
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded ${colors[index]}`}
                                                    data-oid="dtousu5"
                                                ></div>
                                                <div
                                                    className="flex-1 flex justify-between"
                                                    data-oid="s9rpaow"
                                                >
                                                    <span
                                                        className="text-sm font-medium text-gray-700"
                                                        data-oid="8oi7i6l"
                                                    >
                                                        {company.name}
                                                    </span>
                                                    <span
                                                        className="text-sm text-gray-500"
                                                        data-oid="yk4_zn2"
                                                    >
                                                        {company.marketShare}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="flex items-center space-x-3" data-oid=":an7d0u">
                                        <div
                                            className="w-4 h-4 rounded bg-gray-400"
                                            data-oid="nqsyl4x"
                                        ></div>
                                        <div
                                            className="flex-1 flex justify-between"
                                            data-oid="khfx8nq"
                                        >
                                            <span
                                                className="text-sm font-medium text-gray-700"
                                                data-oid="-7w9a1f"
                                            >
                                                Andere
                                            </span>
                                            <span
                                                className="text-sm text-gray-500"
                                                data-oid="ng-xzj3"
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
                                data-oid="xru1_:k"
                            >
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-6"
                                    data-oid="coyv1re"
                                >
                                    Wachstumstrends 2023-2024
                                </h3>
                                <div className="space-y-4" data-oid="r.oqx:4">
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
                                                data-oid="cfaf1r0"
                                            >
                                                <span
                                                    className="text-sm font-medium text-gray-700"
                                                    data-oid=".pb0-5n"
                                                >
                                                    {company.name}
                                                </span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="wovy49o"
                                                >
                                                    <div
                                                        className="w-20 bg-gray-200 rounded-full h-2"
                                                        data-oid="52.tlll"
                                                    >
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${Math.min(Math.max(growth * 5, 0), 100)}%`,
                                                            }}
                                                            data-oid="0iwqkra"
                                                        ></div>
                                                    </div>
                                                    <span
                                                        className="text-sm font-medium text-green-600"
                                                        data-oid="iz7m.gf"
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
