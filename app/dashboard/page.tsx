'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, ITCompany } from '../../lib/database';
import { cronService } from '../../lib/cronService';

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [companies, setCompanies] = useState<ITCompany[]>([]);
    const [isQuerying, setIsQuerying] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [cronStatus, setCronStatus] = useState(false);
    const router = useRouter();

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
        } catch (error) {
            console.error('Error loading data:', error);
            setCompanies([]);
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
        setIsQuerying(true);
        try {
            const result = await cronService.runManualQuery();
            if (result.success) {
                loadData();
                alert('Daten erfolgreich aktualisiert!');
            } else {
                alert(`Fehler beim Abrufen der Daten: ${result.error}`);
            }
        } catch (error) {
            alert('Unerwarteter Fehler beim Abrufen der Daten');
        }
        setIsQuerying(false);
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid=":525sj-"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="gk8hz.-"
                ></div>
            </div>
        );
    }

    const hasData = companies.length > 0;

    return (
        <div className="min-h-screen bg-gray-50" data-oid="b:doozo">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="f3bq.64">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="yzyhspq">
                    <div className="flex justify-between items-center py-4" data-oid=".kxt0rn">
                        <div className="flex items-center space-x-3" data-oid="es43jmi">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="8mtsev-"
                            >
                                <span className="text-white font-bold text-lg" data-oid="b:llh-0">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="pw3-x5m">
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="fyo..2l">
                            <button
                                onClick={goToSettings}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="Einstellungen"
                                data-oid="m6ma_28"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="gf7tv0a"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        data-oid="trsrqct"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        data-oid="7x8l8g3"
                                    />
                                </svg>
                            </button>
                            <span className="text-gray-600" data-oid="inyk74w">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="avvmv6l"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="yzstw4m">
                {/* Header */}
                <div className="mb-8" data-oid="0jy0ie6">
                    <div className="flex justify-between items-center" data-oid="_jr2ldi">
                        <div data-oid="_yw:1no">
                            <h2
                                className="text-3xl font-bold text-gray-900 mb-2"
                                data-oid="t_oc3bw"
                            >
                                Statistik
                            </h2>
                            <p className="text-gray-600" data-oid=".gspcfm">
                                {hasData
                                    ? `Letzte Aktualisierung: ${lastUpdate?.toLocaleString('de-DE')} (${companies.length} Unternehmen)`
                                    : 'Keine Daten verfügbar - Bitte konfigurieren Sie zuerst die AI-Einstellungen'}
                            </p>
                            {/* Debug Info */}
                            <p className="text-xs text-gray-400 mt-1" data-oid="hx5rxgo">
                                Debug: DB Status - Companies: {companies.length}, Settings:{' '}
                                {db.getAPISettings() ? 'Konfiguriert' : 'Nicht konfiguriert'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4" data-oid="omy_gsk">
                            <div className="flex items-center space-x-2" data-oid="9ps5lhk">
                                <div
                                    className={`w-3 h-3 rounded-full ${cronStatus ? 'bg-green-500' : 'bg-red-500'}`}
                                    data-oid="7f-0n.."
                                ></div>
                                <span className="text-sm text-gray-600" data-oid="w8qb0:3">
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
                                data-oid="-mfl-ve"
                            >
                                Debug
                            </button>
                            <button
                                onClick={handleManualQuery}
                                disabled={isQuerying}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="57pnhzw"
                            >
                                {isQuerying ? (
                                    <div className="flex items-center" data-oid=":644k0t">
                                        <div
                                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                            data-oid="o0alpkw"
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
                        data-oid="ymz45o8"
                    >
                        <div
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="113p00w"
                        >
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="hnpy_00"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    data-oid="l6b9txt"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="3.zmonh">
                            Keine Daten verfügbar
                        </h3>
                        <p className="text-gray-600 mb-6" data-oid="6-hbu9u">
                            Um IT-Dienstleister Daten anzuzeigen, müssen Sie zuerst Ihre
                            AI-Einstellungen konfigurieren.
                        </p>
                        <div className="space-y-3" data-oid="hju0siv">
                            <button
                                onClick={goToSettings}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                data-oid="e1xqin7"
                            >
                                Zu den Einstellungen
                            </button>
                            <p className="text-sm text-gray-500" data-oid="w4uai7v">
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
                            data-oid="1d6ombk"
                        >
                            <h3
                                className="text-xl font-semibold text-gray-900 mb-6"
                                data-oid="o6j:4sc"
                            >
                                Umsatzentwicklung (Milliarden €)
                            </h3>
                            <div className="space-y-4" data-oid="1akffyx">
                                {companies.slice(0, 5).map((company) => (
                                    <div
                                        key={company.rank}
                                        className="flex items-center space-x-4"
                                        data-oid="jn2lms9"
                                    >
                                        <div
                                            className="w-32 text-sm font-medium text-gray-700 truncate"
                                            data-oid="5mr_nnl"
                                        >
                                            {company.name}
                                        </div>
                                        <div
                                            className="flex-1 flex items-center space-x-2"
                                            data-oid="ay4m_x7"
                                        >
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                                data-oid="i.-99jd"
                                            >
                                                <div
                                                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.min((company.revenue2023 / 35) * 100, 100)}%`,
                                                    }}
                                                    data-oid="7_o6am4"
                                                >
                                                    <span
                                                        className="text-xs text-white font-medium"
                                                        data-oid="fa28i3u"
                                                    >
                                                        2023: €{company.revenue2023}B
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                                data-oid="4ep-60-"
                                            >
                                                <div
                                                    className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.min((company.revenue2024 / 35) * 100, 100)}%`,
                                                    }}
                                                    data-oid="cv8qfs-"
                                                >
                                                    <span
                                                        className="text-xs text-white font-medium"
                                                        data-oid="svv6548"
                                                    >
                                                        2024: €{company.revenue2024}B
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="w-16 text-sm font-medium text-green-600"
                                                data-oid="sdlow5y"
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
                            data-oid="4aa_e0x"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="qqu:qzw">
                                <h3
                                    className="text-xl font-semibold text-gray-900"
                                    data-oid="6q::hrq"
                                >
                                    Vollständige Rangliste
                                </h3>
                            </div>
                            <div className="overflow-x-auto" data-oid="yuoaz0z">
                                <table className="w-full" data-oid="s8ugn51">
                                    <thead className="bg-gray-50" data-oid="fece_66">
                                        <tr data-oid="sz_ea7_">
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="ev80ldq"
                                            >
                                                Rang
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="s1l6kfp"
                                            >
                                                Unternehmen
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="ltrhrfy"
                                            >
                                                Standort
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="6ks5m1a"
                                            >
                                                Spezialisierung
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="vpdufcb"
                                            >
                                                Umsatz 2024
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="ld67khe"
                                            >
                                                Mitarbeiter
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="tb:341p"
                                            >
                                                Marktanteil
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-gray-200"
                                        data-oid="lbxar7b"
                                    >
                                        {companies.map((company) => (
                                            <tr
                                                key={company.rank}
                                                className="hover:bg-gray-50"
                                                data-oid="f1lai:r"
                                            >
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="zftq0dt"
                                                >
                                                    <div
                                                        className="flex items-center"
                                                        data-oid="b73hv_l"
                                                    >
                                                        <div
                                                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                            data-oid="2gndma5"
                                                        >
                                                            {company.rank}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="tdb5_ig"
                                                >
                                                    <div
                                                        className="text-sm font-medium text-gray-900"
                                                        data-oid="ab4i8fy"
                                                    >
                                                        {company.name}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="ikz92hl"
                                                >
                                                    <div
                                                        className="text-sm text-gray-500"
                                                        data-oid="e6dg_h:"
                                                    >
                                                        {company.location}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="29lssg5"
                                                >
                                                    <span
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                        data-oid="goyvgc6"
                                                    >
                                                        {company.specialty}
                                                    </span>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="s889f7i"
                                                >
                                                    <div
                                                        className="text-sm font-medium text-gray-900"
                                                        data-oid="f2utcnz"
                                                    >
                                                        €{company.revenue2024}B
                                                    </div>
                                                    <div
                                                        className="text-xs text-green-600"
                                                        data-oid="galysrf"
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
                                                    data-oid="90kik2n"
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid="na-12dr"
                                                    >
                                                        {company.employees.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="hssqu35"
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid="2ub9yo8"
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="xmt6usl">
                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                data-oid="b:8_evt"
                            >
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-6"
                                    data-oid="1psej64"
                                >
                                    Marktanteil Verteilung
                                </h3>
                                <div className="space-y-3" data-oid="wcdcvew">
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
                                                data-oid="2bh3zjy"
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded ${colors[index]}`}
                                                    data-oid="7ain2p3"
                                                ></div>
                                                <div
                                                    className="flex-1 flex justify-between"
                                                    data-oid="vgo7u0p"
                                                >
                                                    <span
                                                        className="text-sm font-medium text-gray-700"
                                                        data-oid="godf_2m"
                                                    >
                                                        {company.name}
                                                    </span>
                                                    <span
                                                        className="text-sm text-gray-500"
                                                        data-oid="yamhu:t"
                                                    >
                                                        {company.marketShare}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="flex items-center space-x-3" data-oid="7mgb8l9">
                                        <div
                                            className="w-4 h-4 rounded bg-gray-400"
                                            data-oid="gxa5:1t"
                                        ></div>
                                        <div
                                            className="flex-1 flex justify-between"
                                            data-oid="fgu6kx7"
                                        >
                                            <span
                                                className="text-sm font-medium text-gray-700"
                                                data-oid="szkrjgq"
                                            >
                                                Andere
                                            </span>
                                            <span
                                                className="text-sm text-gray-500"
                                                data-oid="lb0bh:f"
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
                                data-oid="j:lkgg8"
                            >
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-6"
                                    data-oid="s5x-d:n"
                                >
                                    Wachstumstrends 2023-2024
                                </h3>
                                <div className="space-y-4" data-oid="8pw.4jw">
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
                                                data-oid="06ihkjx"
                                            >
                                                <span
                                                    className="text-sm font-medium text-gray-700"
                                                    data-oid="8j.xf-q"
                                                >
                                                    {company.name}
                                                </span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="4rfaj5f"
                                                >
                                                    <div
                                                        className="w-20 bg-gray-200 rounded-full h-2"
                                                        data-oid="k6a0j.z"
                                                    >
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${Math.min(Math.max(growth * 5, 0), 100)}%`,
                                                            }}
                                                            data-oid="ygsqg:r"
                                                        ></div>
                                                    </div>
                                                    <span
                                                        className="text-sm font-medium text-green-600"
                                                        data-oid="0mhg41w"
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
