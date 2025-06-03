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

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="7rgebw."
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="itxbahd"
                ></div>
            </div>
        );
    }

    const stats = [
        { name: 'Toplam Kullanıcı', value: '2,543', change: '+12%', changeType: 'increase' },
        { name: 'Aktif Projeler', value: '18', change: '+3%', changeType: 'increase' },
        { name: 'Tamamlanan Görevler', value: '127', change: '+8%', changeType: 'increase' },
        { name: 'Gelir', value: '₺45,231', change: '-2%', changeType: 'decrease' },
    ];

    const recentActivities = [
        { id: 1, action: 'Yeni proje oluşturuldu', time: '2 saat önce', user: 'Ahmet Yılmaz' },
        { id: 2, action: 'Görev tamamlandı', time: '4 saat önce', user: 'Ayşe Kaya' },
        { id: 3, action: 'Yeni kullanıcı kaydı', time: '6 saat önce', user: 'Mehmet Demir' },
        { id: 4, action: 'Rapor oluşturuldu', time: '1 gün önce', user: 'Fatma Şahin' },
    ];

    return (
        <div className="min-h-screen bg-gray-50" data-oid=":64uwzd">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="xvns2m-">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="lc9xo2:">
                    <div className="flex justify-between items-center py-4" data-oid="h4yy2an">
                        <div className="flex items-center space-x-3" data-oid="7p:_mgh">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="v.kwu:3"
                            >
                                <span className="text-white font-bold text-lg" data-oid="i0okuhk">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="5x4p2ia">
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="izimb53">
                            <span className="text-gray-600" data-oid="eg3r947">
                                Hoş geldin, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="t75meg:"
                            >
                                Çıkış Yap
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="qmyt-yg">
                {/* Welcome Section */}
                <div className="mb-8" data-oid="4f9e.3v">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2" data-oid="f4x3mc1">
                        Hoş geldiniz! 👋
                    </h2>
                    <p className="text-gray-600" data-oid="fdb7kpe">
                        İşte bugünkü özet ve son aktiviteleriniz
                    </p>
                </div>

                {/* Stats Grid */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    data-oid="aginb.4"
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            data-oid="m5a7-8v"
                        >
                            <div className="flex items-center justify-between" data-oid="pxrvhkj">
                                <div data-oid="t260ny9">
                                    <p
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="33j2sju"
                                    >
                                        {stat.name}
                                    </p>
                                    <p
                                        className="text-3xl font-bold text-gray-900 mt-2"
                                        data-oid="xkpf6lr"
                                    >
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`text-sm font-medium ${
                                        stat.changeType === 'increase'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}
                                    data-oid="kq-00w9"
                                >
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid=":8gpy9:">
                    {/* Recent Activities */}
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100"
                        data-oid="lda52.6"
                    >
                        <div className="p-6 border-b border-gray-100" data-oid="9ict67y">
                            <h3 className="text-lg font-semibold text-gray-900" data-oid="gbos36x">
                                Son Aktiviteler
                            </h3>
                        </div>
                        <div className="p-6" data-oid=".rtascm">
                            <div className="space-y-4" data-oid="c71r56o">
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start space-x-3"
                                        data-oid="kfm3_h9"
                                    >
                                        <div
                                            className="w-2 h-2 bg-blue-600 rounded-full mt-2"
                                            data-oid="d8smwea"
                                        ></div>
                                        <div className="flex-1" data-oid="xg50dwi">
                                            <p
                                                className="text-sm font-medium text-gray-900"
                                                data-oid="8j.1sa5"
                                            >
                                                {activity.action}
                                            </p>
                                            <p
                                                className="text-xs text-gray-500 mt-1"
                                                data-oid="-qbpc.j"
                                            >
                                                {activity.user} • {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100"
                        data-oid="osff..t"
                    >
                        <div className="p-6 border-b border-gray-100" data-oid="qqhjdry">
                            <h3 className="text-lg font-semibold text-gray-900" data-oid="0yow12r">
                                Hızlı İşlemler
                            </h3>
                        </div>
                        <div className="p-6" data-oid="taocykr">
                            <div className="grid grid-cols-2 gap-4" data-oid="5n:jiya">
                                <button
                                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                                    data-oid="_tn-wzj"
                                >
                                    <div
                                        className="w-8 h-8 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center"
                                        data-oid="npt-wlc"
                                    >
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="4q85iia"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                                data-oid="7mj5rqx"
                                            />
                                        </svg>
                                    </div>
                                    <span
                                        className="text-sm font-medium text-gray-700"
                                        data-oid="xk_fif:"
                                    >
                                        Yeni Proje
                                    </span>
                                </button>

                                <button
                                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
                                    data-oid="8_g803i"
                                >
                                    <div
                                        className="w-8 h-8 bg-green-600 rounded-lg mx-auto mb-2 flex items-center justify-center"
                                        data-oid="i_4h.fn"
                                    >
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="_i45zjv"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                data-oid="178-s2l"
                                            />
                                        </svg>
                                    </div>
                                    <span
                                        className="text-sm font-medium text-gray-700"
                                        data-oid="3::1_5-"
                                    >
                                        Rapor Oluştur
                                    </span>
                                </button>

                                <button
                                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
                                    data-oid="7tzlm8r"
                                >
                                    <div
                                        className="w-8 h-8 bg-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center"
                                        data-oid="rzgof-n"
                                    >
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="te96jse"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                data-oid="tab600s"
                                            />
                                        </svg>
                                    </div>
                                    <span
                                        className="text-sm font-medium text-gray-700"
                                        data-oid="6rz9-ou"
                                    >
                                        Kullanıcı Ekle
                                    </span>
                                </button>

                                <button
                                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
                                    data-oid="eow1xn3"
                                >
                                    <div
                                        className="w-8 h-8 bg-orange-600 rounded-lg mx-auto mb-2 flex items-center justify-center"
                                        data-oid="nxgw2_i"
                                    >
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="img473q"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                data-oid="n67vpk9"
                                            />

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                data-oid="_9wrt5t"
                                            />
                                        </svg>
                                    </div>
                                    <span
                                        className="text-sm font-medium text-gray-700"
                                        data-oid="mj0i4c2"
                                    >
                                        Ayarlar
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
