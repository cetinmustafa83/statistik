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
                data-oid="ig618.z"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid=".08favl"
                ></div>
            </div>
        );
    }

    const hasData = companies.length > 0;

    return (
        <div className="min-h-screen bg-gray-50" data-oid="7gxhsd6">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="h14gqox">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="ck6n1xe">
                    <div className="flex justify-between items-center py-4" data-oid="0tdqvfx">
                        <div className="flex items-center space-x-3" data-oid="92nsec5">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="l1rh0-c"
                            >
                                <span className="text-white font-bold text-lg" data-oid="rd:-f77">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="_xrma4m">
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid=".nsj8mw">
                            <button
                                onClick={() => router.push('/ai-search')}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="AI Search"
                                data-oid="wl-hlg6"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="g-le8.u"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        data-oid="aefavdc"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={goToSettings}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="Einstellungen"
                                data-oid="23qrxmf"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="s39oldu"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        data-oid="_4nn9t0"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        data-oid="4_i2sx4"
                                    />
                                </svg>
                            </button>
                            <span className="text-gray-600" data-oid="tlvs77e">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid=".1kebgf"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="6mhai9o">
                {/* Header */}
                <div className="mb-8" data-oid="eps99:4">
                    <div className="flex justify-between items-center" data-oid="7:yh18c">
                        <div data-oid="vijf8ir">
                            <h2
                                className="text-3xl font-bold text-gray-900 mb-2"
                                data-oid="lld2rl5"
                            >
                                Statistik
                            </h2>
                            <p className="text-gray-600" data-oid="xl8q5c7">
                                {hasData
                                    ? `Letzte Aktualisierung: ${lastUpdate?.toLocaleString('de-DE')} (${companies.length} Unternehmen)`
                                    : 'Keine Daten verfügbar - Bitte konfigurieren Sie zuerst die AI-Einstellungen'}
                            </p>
                            {/* Debug Info */}
                            <p className="text-xs text-gray-400 mt-1" data-oid="noxd8c5">
                                Debug: DB Status - Companies: {companies.length}, Settings:{' '}
                                {db.getAPISettings() ? 'Konfiguriert' : 'Nicht konfiguriert'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4" data-oid="j00koo:">
                            <div className="flex items-center space-x-2" data-oid="gy_fufo">
                                <div
                                    className={`w-3 h-3 rounded-full ${cronStatus ? 'bg-green-500' : 'bg-red-500'}`}
                                    data-oid="7ps2:yk"
                                ></div>
                                <span className="text-sm text-gray-600" data-oid="9oyuu1c">
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
                                data-oid="x-dz96s"
                            >
                                Debug
                            </button>
                            <button
                                onClick={handleManualQuery}
                                disabled={isQuerying}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="1kdtn_7"
                            >
                                {isQuerying ? (
                                    <div className="flex items-center" data-oid="r4wp10a">
                                        <div
                                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                            data-oid="h0n46hh"
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
                        data-oid="u_9scr8"
                    >
                        <div
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="-9qz3w6"
                        >
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="v1kk0g1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    data-oid="gducz:y"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="b1hsh0q">
                            Keine Daten verfügbar
                        </h3>
                        <p className="text-gray-600 mb-6" data-oid="t2g4uyo">
                            Um IT-Dienstleister Daten anzuzeigen, müssen Sie zuerst Ihre
                            AI-Einstellungen konfigurieren.
                        </p>
                        <div className="space-y-3" data-oid="-z245ho">
                            <button
                                onClick={goToSettings}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                data-oid="nkilhur"
                            >
                                Zu den Einstellungen
                            </button>
                            <p className="text-sm text-gray-500" data-oid="nii84o.">
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
                            data-oid="axb_qxv"
                        >
                            <h3
                                className="text-xl font-semibold text-gray-900 mb-6"
                                data-oid="as0gaak"
                            >
                                Umsatzentwicklung (Milliarden €)
                            </h3>
                            <div className="space-y-4" data-oid=".-jhgw.">
                                {companies.slice(0, 5).map((company) => (
                                    <div
                                        key={company.rank}
                                        className="flex items-center space-x-4"
                                        data-oid="dzi2.:w"
                                    >
                                        <div
                                            className="w-32 text-sm font-medium text-gray-700 truncate"
                                            data-oid="y:pd_u0"
                                        >
                                            {company.name}
                                        </div>
                                        <div
                                            className="flex-1 flex items-center space-x-2"
                                            data-oid="g-54cey"
                                        >
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                                data-oid="ncf6hqc"
                                            >
                                                <div
                                                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.min((company.revenue2023 / 35) * 100, 100)}%`,
                                                    }}
                                                    data-oid="hitb71."
                                                >
                                                    <span
                                                        className="text-xs text-white font-medium"
                                                        data-oid="gpbyxtn"
                                                    >
                                                        2023: €{company.revenue2023}B
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                                data-oid="w:lftr."
                                            >
                                                <div
                                                    className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.min((company.revenue2024 / 35) * 100, 100)}%`,
                                                    }}
                                                    data-oid="171mn15"
                                                >
                                                    <span
                                                        className="text-xs text-white font-medium"
                                                        data-oid="m_._nla"
                                                    >
                                                        2024: €{company.revenue2024}B
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="w-16 text-sm font-medium text-green-600"
                                                data-oid="i2fily1"
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
                            data-oid="p4l3_ly"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="sqw8wlq">
                                <h3
                                    className="text-xl font-semibold text-gray-900"
                                    data-oid="imlsy8y"
                                >
                                    Vollständige Rangliste
                                </h3>
                            </div>
                            <div className="overflow-x-auto" data-oid="uysg_f9">
                                <table className="w-full" data-oid="b7i9sf.">
                                    <thead className="bg-gray-50" data-oid="3iff5wh">
                                        <tr data-oid="1pos5fd">
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="cgrpc5x"
                                            >
                                                Rang
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="712iz0c"
                                            >
                                                Unternehmen
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="wdn:xmy"
                                            >
                                                Standort
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="o_.zlv_"
                                            >
                                                Spezialisierung
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="9gckdr2"
                                            >
                                                Umsatz 2024
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="7qn_eb5"
                                            >
                                                Mitarbeiter
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="36.fwn_"
                                            >
                                                Marktanteil
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-gray-200"
                                        data-oid="j5rcr_x"
                                    >
                                        {companies.map((company) => (
                                            <tr
                                                key={company.rank}
                                                className="hover:bg-gray-50"
                                                data-oid="3j_aa:h"
                                            >
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="r4jq-.j"
                                                >
                                                    <div
                                                        className="flex items-center"
                                                        data-oid="d9dg:cs"
                                                    >
                                                        <div
                                                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                            data-oid="9g4r5ys"
                                                        >
                                                            {company.rank}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="67r72rd"
                                                >
                                                    <div
                                                        className="text-sm font-medium text-gray-900"
                                                        data-oid="9prprjx"
                                                    >
                                                        {company.name}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="71_-58j"
                                                >
                                                    <div
                                                        className="text-sm text-gray-500"
                                                        data-oid="j.4cq:r"
                                                    >
                                                        {company.location}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="949j55r"
                                                >
                                                    <span
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                        data-oid="qjax.pm"
                                                    >
                                                        {company.specialty}
                                                    </span>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="4nbk_5h"
                                                >
                                                    <div
                                                        className="text-sm font-medium text-gray-900"
                                                        data-oid="n021b-5"
                                                    >
                                                        €{company.revenue2024}B
                                                    </div>
                                                    <div
                                                        className="text-xs text-green-600"
                                                        data-oid="8m5p4_x"
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
                                                    data-oid="9yeweww"
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid="m9bndri"
                                                    >
                                                        {company.employees.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="qiwzxnr"
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid="s_s3ua8"
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="acawrkw">
                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                data-oid="v69d-_o"
                            >
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-6"
                                    data-oid=".4thuja"
                                >
                                    Marktanteil Verteilung
                                </h3>
                                <div className="space-y-3" data-oid="9gaohqm">
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
                                                data-oid="ma3qhkz"
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded ${colors[index]}`}
                                                    data-oid="hlo:jf_"
                                                ></div>
                                                <div
                                                    className="flex-1 flex justify-between"
                                                    data-oid="gt2-len"
                                                >
                                                    <span
                                                        className="text-sm font-medium text-gray-700"
                                                        data-oid="7-xwk5p"
                                                    >
                                                        {company.name}
                                                    </span>
                                                    <span
                                                        className="text-sm text-gray-500"
                                                        data-oid="6:prt9h"
                                                    >
                                                        {company.marketShare}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="flex items-center space-x-3" data-oid="w20pe.j">
                                        <div
                                            className="w-4 h-4 rounded bg-gray-400"
                                            data-oid="cc2rvst"
                                        ></div>
                                        <div
                                            className="flex-1 flex justify-between"
                                            data-oid="p3y9cxg"
                                        >
                                            <span
                                                className="text-sm font-medium text-gray-700"
                                                data-oid="5.xm3yg"
                                            >
                                                Andere
                                            </span>
                                            <span
                                                className="text-sm text-gray-500"
                                                data-oid="ho5ig9p"
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
                                data-oid="khimjq-"
                            >
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-6"
                                    data-oid="-7omfwo"
                                >
                                    Wachstumstrends 2023-2024
                                </h3>
                                <div className="space-y-4" data-oid="0vo7rsn">
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
                                                data-oid="g0sd6s1"
                                            >
                                                <span
                                                    className="text-sm font-medium text-gray-700"
                                                    data-oid="wl9wn3e"
                                                >
                                                    {company.name}
                                                </span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="5.w2tuh"
                                                >
                                                    <div
                                                        className="w-20 bg-gray-200 rounded-full h-2"
                                                        data-oid="2ue9i3z"
                                                    >
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${Math.min(Math.max(growth * 5, 0), 100)}%`,
                                                            }}
                                                            data-oid="1e_1jta"
                                                        ></div>
                                                    </div>
                                                    <span
                                                        className="text-sm font-medium text-green-600"
                                                        data-oid="ksrkw85"
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
