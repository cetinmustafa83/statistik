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
                data-oid="2dbm1ms"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="3j15b1_"
                ></div>
            </div>
        );
    }

    const hasData = companies.length > 0;

    return (
        <div className="min-h-screen bg-gray-50" data-oid="08ofvsi">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="41pieqt">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="kc6v4i3">
                    <div className="flex justify-between items-center py-4" data-oid="8:v2fw0">
                        <div className="flex items-center space-x-3" data-oid="5klhv:r">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="f3ch2b-"
                            >
                                <span className="text-white font-bold text-lg" data-oid=".3dh28s">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="tb2ezz_">
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="dsec.do">
                            <button
                                onClick={() => router.push('/ai-search')}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="AI Search"
                                data-oid="62b4u0g"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="tmzw7mc"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        data-oid="0pv:rib"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={goToSettings}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="Einstellungen"
                                data-oid="yz:.1qd"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="tezvxl8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        data-oid="x_0hz6."
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        data-oid="hyg:gvb"
                                    />
                                </svg>
                            </button>
                            <span className="text-gray-600" data-oid="c40nawv">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="mzw54u8"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="xgxu4nf">
                {/* Header */}
                <div className="mb-8" data-oid="lzdbvj7">
                    <div className="flex justify-between items-center" data-oid="-d3me8z">
                        <div data-oid="2f.rrd1">
                            <h2
                                className="text-3xl font-bold text-gray-900 mb-2"
                                data-oid="zgxn13f"
                            >
                                Statistik
                            </h2>
                            <p className="text-gray-600" data-oid="vsohtyf">
                                {hasData
                                    ? `Letzte Aktualisierung: ${lastUpdate?.toLocaleString('de-DE')} (${companies.length} Unternehmen)`
                                    : 'Keine Daten verfügbar - Bitte konfigurieren Sie zuerst die AI-Einstellungen'}
                            </p>
                            {/* Debug Info */}
                            <p className="text-xs text-gray-400 mt-1" data-oid="731i420">
                                Debug: DB Status - Companies: {companies.length}, Settings:{' '}
                                {db.getAPISettings() ? 'Konfiguriert' : 'Nicht konfiguriert'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4" data-oid="duca-v7">
                            <div className="flex items-center space-x-2" data-oid="47gz.ki">
                                <div
                                    className={`w-3 h-3 rounded-full ${cronStatus ? 'bg-green-500' : 'bg-red-500'}`}
                                    data-oid="w1:jprq"
                                ></div>
                                <span className="text-sm text-gray-600" data-oid="nrm0mz0">
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
                                data-oid="jjpxtn4"
                            >
                                Debug
                            </button>
                            <button
                                onClick={handleManualQuery}
                                disabled={isQuerying}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="wu.kz-c"
                            >
                                {isQuerying ? (
                                    <div className="flex items-center" data-oid="gwa5lvo">
                                        <div
                                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                            data-oid="09rjxz1"
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
                        data-oid="2p-he9e"
                    >
                        <div
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="17l-t-u"
                        >
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="2.nls9-"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    data-oid="g6-ixve"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="a7fvw3w">
                            Keine Daten verfügbar
                        </h3>
                        <p className="text-gray-600 mb-6" data-oid="3p-fl25">
                            Um IT-Dienstleister Daten anzuzeigen, müssen Sie zuerst Ihre
                            AI-Einstellungen konfigurieren.
                        </p>
                        <div className="space-y-3" data-oid="cqpn0mv">
                            <button
                                onClick={goToSettings}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                data-oid="-8nx48z"
                            >
                                Zu den Einstellungen
                            </button>
                            <p className="text-sm text-gray-500" data-oid="tqbtur1">
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
                            data-oid="xqbp3z1"
                        >
                            <h3
                                className="text-xl font-semibold text-gray-900 mb-6"
                                data-oid="k9edihu"
                            >
                                Umsatzentwicklung (Milliarden €)
                            </h3>
                            <div className="space-y-4" data-oid="44m4kr9">
                                {companies.slice(0, 5).map((company) => (
                                    <div
                                        key={company.rank}
                                        className="flex items-center space-x-4"
                                        data-oid="c5k4trv"
                                    >
                                        <div
                                            className="w-32 text-sm font-medium text-gray-700 truncate"
                                            data-oid="i.36glo"
                                        >
                                            {company.name}
                                        </div>
                                        <div
                                            className="flex-1 flex items-center space-x-2"
                                            data-oid="mzp2fjl"
                                        >
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                                data-oid="dumcpu5"
                                            >
                                                <div
                                                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.min((company.revenue2023 / 35) * 100, 100)}%`,
                                                    }}
                                                    data-oid="0hf5aro"
                                                >
                                                    <span
                                                        className="text-xs text-white font-medium"
                                                        data-oid="ipryfxy"
                                                    >
                                                        2023: €{company.revenue2023}B
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                                data-oid="v8-97h3"
                                            >
                                                <div
                                                    className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.min((company.revenue2024 / 35) * 100, 100)}%`,
                                                    }}
                                                    data-oid=":ohdz57"
                                                >
                                                    <span
                                                        className="text-xs text-white font-medium"
                                                        data-oid="j7mxb27"
                                                    >
                                                        2024: €{company.revenue2024}B
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="w-16 text-sm font-medium text-green-600"
                                                data-oid="ftjda-o"
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
                            data-oid="fe4x4l7"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="v:0vks5">
                                <h3
                                    className="text-xl font-semibold text-gray-900"
                                    data-oid="pvxupbp"
                                >
                                    Vollständige Rangliste
                                </h3>
                            </div>
                            <div className="overflow-x-auto" data-oid="ukkv0s2">
                                <table className="w-full" data-oid="215:j9h">
                                    <thead className="bg-gray-50" data-oid="_3wjxpj">
                                        <tr data-oid="ye4yf28">
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid=".qt3llv"
                                            >
                                                Rang
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="gl.dzzy"
                                            >
                                                Unternehmen
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="4e169r1"
                                            >
                                                Standort
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="u-fhuah"
                                            >
                                                Spezialisierung
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="xky7odx"
                                            >
                                                Umsatz 2024
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="-t7hq:h"
                                            >
                                                Mitarbeiter
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="f-548uo"
                                            >
                                                Marktanteil
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-gray-200"
                                        data-oid="7m.fo37"
                                    >
                                        {companies.map((company) => (
                                            <tr
                                                key={company.rank}
                                                className="hover:bg-gray-50"
                                                data-oid="-end82a"
                                            >
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="zviulqc"
                                                >
                                                    <div
                                                        className="flex items-center"
                                                        data-oid="c-.:ipt"
                                                    >
                                                        <div
                                                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                            data-oid="g5w8p9x"
                                                        >
                                                            {company.rank}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="w.y-ujd"
                                                >
                                                    <div
                                                        className="text-sm font-medium text-gray-900"
                                                        data-oid="1u51i31"
                                                    >
                                                        {company.name}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="168o92s"
                                                >
                                                    <div
                                                        className="text-sm text-gray-500"
                                                        data-oid="b.ev93q"
                                                    >
                                                        {company.location}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="m8tu:9c"
                                                >
                                                    <span
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                        data-oid="zv_6efu"
                                                    >
                                                        {company.specialty}
                                                    </span>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="j2ynygt"
                                                >
                                                    <div
                                                        className="text-sm font-medium text-gray-900"
                                                        data-oid="4sz93gk"
                                                    >
                                                        €{company.revenue2024}B
                                                    </div>
                                                    <div
                                                        className="text-xs text-green-600"
                                                        data-oid="wii3ujc"
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
                                                    data-oid="y3j.l11"
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid="jmgwev2"
                                                    >
                                                        {company.employees.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="487k4:k"
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid="mojmjdk"
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="vj:dvd5">
                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                data-oid="cudxioa"
                            >
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-6"
                                    data-oid="ajmzbkl"
                                >
                                    Marktanteil Verteilung
                                </h3>
                                <div className="space-y-3" data-oid="syphjyf">
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
                                                data-oid="np0e:fb"
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded ${colors[index]}`}
                                                    data-oid="-crp0nt"
                                                ></div>
                                                <div
                                                    className="flex-1 flex justify-between"
                                                    data-oid="7848j0x"
                                                >
                                                    <span
                                                        className="text-sm font-medium text-gray-700"
                                                        data-oid="73u6nr0"
                                                    >
                                                        {company.name}
                                                    </span>
                                                    <span
                                                        className="text-sm text-gray-500"
                                                        data-oid="l5n76x_"
                                                    >
                                                        {company.marketShare}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="flex items-center space-x-3" data-oid="hkiipo8">
                                        <div
                                            className="w-4 h-4 rounded bg-gray-400"
                                            data-oid="llez:6t"
                                        ></div>
                                        <div
                                            className="flex-1 flex justify-between"
                                            data-oid="_pj:c5s"
                                        >
                                            <span
                                                className="text-sm font-medium text-gray-700"
                                                data-oid="3.oalg:"
                                            >
                                                Andere
                                            </span>
                                            <span
                                                className="text-sm text-gray-500"
                                                data-oid="-jj2u6-"
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
                                data-oid="ogzro_:"
                            >
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-6"
                                    data-oid="czs6s2s"
                                >
                                    Wachstumstrends 2023-2024
                                </h3>
                                <div className="space-y-4" data-oid="6vn0gpp">
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
                                                data-oid=".0_0w58"
                                            >
                                                <span
                                                    className="text-sm font-medium text-gray-700"
                                                    data-oid=".6wy5zb"
                                                >
                                                    {company.name}
                                                </span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="opo2g_v"
                                                >
                                                    <div
                                                        className="w-20 bg-gray-200 rounded-full h-2"
                                                        data-oid="gixhuj_"
                                                    >
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${Math.min(Math.max(growth * 5, 0), 100)}%`,
                                                            }}
                                                            data-oid=":tdc6xe"
                                                        ></div>
                                                    </div>
                                                    <span
                                                        className="text-sm font-medium text-green-600"
                                                        data-oid="zdug:3_"
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
