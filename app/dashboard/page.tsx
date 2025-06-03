'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    const goToSettings = () => {
        router.push('/settings');
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="lxqm0.g"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="1tgvs-r"
                ></div>
            </div>
        );
    }

    // Top 10 IT Companies Data with 2 years of data
    const itCompanies = [
        {
            rank: 1,
            name: 'SAP SE',
            location: 'Walldorf',
            specialty: 'Enterprise Software',
            revenue2023: 31.9,
            revenue2024: 33.2,
            employees: 112000,
            marketShare: 15.2,
        },
        {
            rank: 2,
            name: 'Siemens Digital Industries',
            location: 'München',
            specialty: 'Industrial IoT',
            revenue2023: 18.4,
            revenue2024: 19.8,
            employees: 76000,
            marketShare: 12.8,
        },
        {
            rank: 3,
            name: 'T-Systems',
            location: 'Frankfurt',
            specialty: 'Cloud Services',
            revenue2023: 4.2,
            revenue2024: 4.6,
            employees: 28000,
            marketShare: 8.5,
        },
        {
            rank: 4,
            name: 'Accenture Deutschland',
            location: 'Düsseldorf',
            specialty: 'Digital Transformation',
            revenue2023: 3.8,
            revenue2024: 4.3,
            employees: 25000,
            marketShare: 7.2,
        },
        {
            rank: 5,
            name: 'IBM Deutschland',
            location: 'Stuttgart',
            specialty: 'AI & Analytics',
            revenue2023: 3.5,
            revenue2024: 3.9,
            employees: 22000,
            marketShare: 6.8,
        },
        {
            rank: 6,
            name: 'Capgemini Deutschland',
            location: 'Berlin',
            specialty: 'Consulting & Technology',
            revenue2023: 3.1,
            revenue2024: 3.5,
            employees: 20000,
            marketShare: 5.9,
        },
        {
            rank: 7,
            name: 'Atos Deutschland',
            location: 'München',
            specialty: 'Cybersecurity',
            revenue2023: 2.8,
            revenue2024: 3.1,
            employees: 18000,
            marketShare: 5.2,
        },
        {
            rank: 8,
            name: 'Cognizant Deutschland',
            location: 'Frankfurt',
            specialty: 'Digital Engineering',
            revenue2023: 2.5,
            revenue2024: 2.9,
            employees: 16000,
            marketShare: 4.8,
        },
        {
            rank: 9,
            name: 'Wipro Deutschland',
            location: 'Hamburg',
            specialty: 'Cloud Migration',
            revenue2023: 2.2,
            revenue2024: 2.6,
            employees: 14000,
            marketShare: 4.1,
        },
        {
            rank: 10,
            name: 'HCL Technologies',
            location: 'Düsseldorf',
            specialty: 'Software Development',
            revenue2023: 2.0,
            revenue2024: 2.3,
            employees: 12000,
            marketShare: 3.7,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50" data-oid="ml7.s9v">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="m6eivzy">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="-1cd5q9">
                    <div className="flex justify-between items-center py-4" data-oid="alq0gw7">
                        <div className="flex items-center space-x-3" data-oid="1t.-q95">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="6nlz01h"
                            >
                                <span className="text-white font-bold text-lg" data-oid="4:og192">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="8ovlk6.">
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="ab35c5g">
                            <button
                                onClick={goToSettings}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="Einstellungen"
                                data-oid="vm1s.v1"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="o2vs343"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        data-oid="p76ikz4"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        data-oid="h1e:do:"
                                    />
                                </svg>
                            </button>
                            <span className="text-gray-600" data-oid="1jo8msu">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="5dls383"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="5xskjf8">
                {/* Header */}
                <div className="mb-8" data-oid="qr8.fk1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2" data-oid="cn0:aqc">
                        Top 10 IT-Dienstleister Deutschland 📊
                    </h2>
                    <p className="text-gray-600" data-oid="b8ec331">
                        Analyse der führenden IT-Unternehmen mit 2-Jahres-Vergleich (2023-2024)
                    </p>
                </div>

                {/* Revenue Chart */}
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
                    data-oid="e_0ntz2"
                >
                    <h3 className="text-xl font-semibold text-gray-900 mb-6" data-oid=":6cg1nq">
                        Umsatzentwicklung (Milliarden €)
                    </h3>
                    <div className="space-y-4" data-oid="l-4h.nu">
                        {itCompanies.slice(0, 5).map((company) => (
                            <div
                                key={company.rank}
                                className="flex items-center space-x-4"
                                data-oid="h0piujz"
                            >
                                <div
                                    className="w-32 text-sm font-medium text-gray-700 truncate"
                                    data-oid="qynnr0y"
                                >
                                    {company.name}
                                </div>
                                <div
                                    className="flex-1 flex items-center space-x-2"
                                    data-oid="rudo7vw"
                                >
                                    <div
                                        className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                        data-oid="zviq.d0"
                                    >
                                        <div
                                            className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                                            style={{
                                                width: `${(company.revenue2023 / 35) * 100}%`,
                                            }}
                                            data-oid="i1qmg2:"
                                        >
                                            <span
                                                className="text-xs text-white font-medium"
                                                data-oid="asoenp7"
                                            >
                                                2023: €{company.revenue2023}B
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                        data-oid="9tl7:7-"
                                    >
                                        <div
                                            className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                                            style={{
                                                width: `${(company.revenue2024 / 35) * 100}%`,
                                            }}
                                            data-oid="f:e:i.t"
                                        >
                                            <span
                                                className="text-xs text-white font-medium"
                                                data-oid="w74rd.6"
                                            >
                                                2024: €{company.revenue2024}B
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="w-16 text-sm font-medium text-green-600"
                                        data-oid="2zzs1pg"
                                    >
                                        +
                                        {(
                                            ((company.revenue2024 - company.revenue2023) /
                                                company.revenue2023) *
                                            100
                                        ).toFixed(1)}
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
                    data-oid="lu9cfyw"
                >
                    <div className="p-6 border-b border-gray-100" data-oid="u8:3.t7">
                        <h3 className="text-xl font-semibold text-gray-900" data-oid="k6u59qw">
                            Vollständige Rangliste
                        </h3>
                    </div>
                    <div className="overflow-x-auto" data-oid="0zt7gc3">
                        <table className="w-full" data-oid=":yqhssk">
                            <thead className="bg-gray-50" data-oid="1ta87dw">
                                <tr data-oid="wt2y7la">
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        data-oid="a8-_9-t"
                                    >
                                        Rang
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        data-oid="el8m6y9"
                                    >
                                        Unternehmen
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        data-oid="rya30yv"
                                    >
                                        Standort
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        data-oid="v7ksy8_"
                                    >
                                        Spezialisierung
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        data-oid="cfwewtm"
                                    >
                                        Umsatz 2024
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        data-oid="zjp5loi"
                                    >
                                        Mitarbeiter
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        data-oid="t.mh1ii"
                                    >
                                        Marktanteil
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200" data-oid="1.s22o0">
                                {itCompanies.map((company) => (
                                    <tr
                                        key={company.rank}
                                        className="hover:bg-gray-50"
                                        data-oid="jkaox::"
                                    >
                                        <td
                                            className="px-6 py-4 whitespace-nowrap"
                                            data-oid="8ao.:-h"
                                        >
                                            <div className="flex items-center" data-oid="gll75-_">
                                                <div
                                                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                    data-oid="t9nwxqe"
                                                >
                                                    {company.rank}
                                                </div>
                                            </div>
                                        </td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap"
                                            data-oid="t:z-7e5"
                                        >
                                            <div
                                                className="text-sm font-medium text-gray-900"
                                                data-oid="y:q9cs8"
                                            >
                                                {company.name}
                                            </div>
                                        </td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap"
                                            data-oid="ukfvhjz"
                                        >
                                            <div
                                                className="text-sm text-gray-500"
                                                data-oid="x_wf16m"
                                            >
                                                {company.location}
                                            </div>
                                        </td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap"
                                            data-oid="ki9yf73"
                                        >
                                            <span
                                                className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                data-oid="r5xiity"
                                            >
                                                {company.specialty}
                                            </span>
                                        </td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap"
                                            data-oid="2qn0y8_"
                                        >
                                            <div
                                                className="text-sm font-medium text-gray-900"
                                                data-oid="7ygl2i_"
                                            >
                                                €{company.revenue2024}B
                                            </div>
                                            <div
                                                className="text-xs text-green-600"
                                                data-oid="roqfaz5"
                                            >
                                                +
                                                {(
                                                    ((company.revenue2024 - company.revenue2023) /
                                                        company.revenue2023) *
                                                    100
                                                ).toFixed(1)}
                                                % vs 2023
                                            </div>
                                        </td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap"
                                            data-oid="umvzza5"
                                        >
                                            <div
                                                className="text-sm text-gray-900"
                                                data-oid="y.sy732"
                                            >
                                                {company.employees.toLocaleString()}
                                            </div>
                                        </td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap"
                                            data-oid="n5f3zb5"
                                        >
                                            <div
                                                className="text-sm text-gray-900"
                                                data-oid="a:.jp00"
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

                {/* Market Share Pie Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid=".1l07oy">
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        data-oid="zfumpdw"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-6" data-oid="_g_in3:">
                            Marktanteil Verteilung
                        </h3>
                        <div className="space-y-3" data-oid="6ybgx_j">
                            {itCompanies.slice(0, 5).map((company, index) => {
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
                                        data-oid="dvxmecy"
                                    >
                                        <div
                                            className={`w-4 h-4 rounded ${colors[index]}`}
                                            data-oid="akiduim"
                                        ></div>
                                        <div
                                            className="flex-1 flex justify-between"
                                            data-oid="tmbf8to"
                                        >
                                            <span
                                                className="text-sm font-medium text-gray-700"
                                                data-oid="4dbm7n2"
                                            >
                                                {company.name}
                                            </span>
                                            <span
                                                className="text-sm text-gray-500"
                                                data-oid="jz6b.mb"
                                            >
                                                {company.marketShare}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="flex items-center space-x-3" data-oid="2w6-x1.">
                                <div
                                    className="w-4 h-4 rounded bg-gray-400"
                                    data-oid="2v3jg5d"
                                ></div>
                                <div className="flex-1 flex justify-between" data-oid=":-kjvuq">
                                    <span
                                        className="text-sm font-medium text-gray-700"
                                        data-oid="x4g2ozk"
                                    >
                                        Andere
                                    </span>
                                    <span className="text-sm text-gray-500" data-oid=".pae17g">
                                        {(
                                            100 -
                                            itCompanies
                                                .slice(0, 5)
                                                .reduce(
                                                    (sum, company) => sum + company.marketShare,
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
                        data-oid=":txs34l"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-6" data-oid="h.n7d8v">
                            Wachstumstrends 2023-2024
                        </h3>
                        <div className="space-y-4" data-oid="70o_634">
                            {itCompanies.slice(0, 5).map((company) => {
                                const growth =
                                    ((company.revenue2024 - company.revenue2023) /
                                        company.revenue2023) *
                                    100;
                                return (
                                    <div
                                        key={company.rank}
                                        className="flex items-center justify-between"
                                        data-oid="vtyk_yx"
                                    >
                                        <span
                                            className="text-sm font-medium text-gray-700"
                                            data-oid="h9q2hf0"
                                        >
                                            {company.name}
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="-403ius"
                                        >
                                            <div
                                                className="w-20 bg-gray-200 rounded-full h-2"
                                                data-oid="5exr75e"
                                            >
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min(growth * 5, 100)}%`,
                                                    }}
                                                    data-oid="vqx5cl:"
                                                ></div>
                                            </div>
                                            <span
                                                className="text-sm font-medium text-green-600"
                                                data-oid="2:g2_:-"
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
            </main>
        </div>
    );
}
