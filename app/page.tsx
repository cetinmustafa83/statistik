'use client';

import { useState, useEffect } from 'react';

export default function Page() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const itServices = [
        { name: 'SAP SE', location: 'Walldorf', specialty: 'Enterprise Software', rating: 9.8 },
        {
            name: 'Siemens Digital Industries',
            location: 'München',
            specialty: 'Industrial IoT',
            rating: 9.7,
        },
        { name: 'T-Systems', location: 'Frankfurt', specialty: 'Cloud Services', rating: 9.5 },
        {
            name: 'Accenture Deutschland',
            location: 'Düsseldorf',
            specialty: 'Digital Transformation',
            rating: 9.4,
        },
        {
            name: 'IBM Deutschland',
            location: 'Stuttgart',
            specialty: 'AI & Analytics',
            rating: 9.3,
        },
        {
            name: 'Capgemini Deutschland',
            location: 'Berlin',
            specialty: 'Consulting & Technology',
            rating: 9.2,
        },
        { name: 'Atos Deutschland', location: 'München', specialty: 'Cybersecurity', rating: 9.1 },
        {
            name: 'Cognizant Deutschland',
            location: 'Frankfurt',
            specialty: 'Digital Engineering',
            rating: 9.0,
        },
        {
            name: 'Wipro Deutschland',
            location: 'Hamburg',
            specialty: 'Cloud Migration',
            rating: 8.9,
        },
        {
            name: 'HCL Technologies',
            location: 'Düsseldorf',
            specialty: 'Software Development',
            rating: 8.8,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" data-oid="amqhh0f">
            {/* Navigation */}
            <nav
                className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
                data-oid="j935uy2"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="g2ouv5x">
                    <div className="flex justify-between items-center py-4" data-oid="k:ci830">
                        <div className="flex items-center space-x-2" data-oid="7cgreqa">
                            <div
                                className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
                                data-oid="s1s00ni"
                            >
                                <span className="text-white font-bold text-sm" data-oid="d-6um13">
                                    IT
                                </span>
                            </div>
                            <span
                                className="text-xl font-semibold text-gray-900"
                                data-oid="c828zr8"
                            >
                                IT-Ranking Deutschland
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8" data-oid="53hkrvn">
                            <a
                                href="#rankings"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="fvrlp9:"
                            >
                                Rankings
                            </a>
                            <a
                                href="#services"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="y-fkugh"
                            >
                                Dienstleistungen
                            </a>
                            <a
                                href="#about"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                data-oid="frcv6rw"
                            >
                                Über uns
                            </a>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                data-oid="tg4nm1o"
                            >
                                Kontakt
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8" data-oid="vbgqwja">
                <div className="max-w-7xl mx-auto" data-oid="w12i00b">
                    <div className="text-center" data-oid="wqz3sxg">
                        <div
                            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            data-oid="404_xbm"
                        >
                            <h1
                                className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                                data-oid="wvl59a8"
                            >
                                Top 10
                                <span
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                                    data-oid="t..0i3:"
                                >
                                    {' '}
                                    IT-Dienstleister
                                </span>
                                <br data-oid=":wc-8_-" />
                                in Deutschland
                            </h1>
                            <p
                                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
                                data-oid="8rijfh3"
                            >
                                Entdecken Sie die führenden IT-Unternehmen Deutschlands. Umfassende
                                Bewertungen, Spezialisierungen und Standorte der besten
                                Technologie-Dienstleister.
                            </p>
                            <div
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                                data-oid="b.gg2vj"
                            >
                                <button
                                    className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                                    data-oid="dwchgtw"
                                >
                                    Rankings ansehen
                                </button>
                                <button
                                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all"
                                    data-oid="___10fw"
                                >
                                    Mehr erfahren
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white" data-oid="3zj1far">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="rxz3k-a">
                    <div
                        className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
                        data-oid="s6psuyc"
                    >
                        <div className="p-6" data-oid="jczb-ag">
                            <div
                                className="text-4xl font-bold text-blue-600 mb-2"
                                data-oid="zjh:68h"
                            >
                                500+
                            </div>
                            <div className="text-gray-600" data-oid="gt-0bcw">
                                Bewertete Unternehmen
                            </div>
                        </div>
                        <div className="p-6" data-oid="da-u84w">
                            <div
                                className="text-4xl font-bold text-blue-600 mb-2"
                                data-oid="xcggjkq"
                            >
                                50k+
                            </div>
                            <div className="text-gray-600" data-oid="-f1k.nv">
                                IT-Experten
                            </div>
                        </div>
                        <div className="p-6" data-oid="ze544iu">
                            <div
                                className="text-4xl font-bold text-blue-600 mb-2"
                                data-oid="8njjhhx"
                            >
                                16
                            </div>
                            <div className="text-gray-600" data-oid="ca:201b">
                                Bundesländer
                            </div>
                        </div>
                        <div className="p-6" data-oid="pxxk.8x">
                            <div
                                className="text-4xl font-bold text-blue-600 mb-2"
                                data-oid="vo6jfwf"
                            >
                                24/7
                            </div>
                            <div className="text-gray-600" data-oid="0ox.0z:">
                                Aktuelle Daten
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rankings Section */}
            <section
                id="rankings"
                className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
                data-oid="otqqv8q"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="9rk2g7y">
                    <div className="text-center mb-16" data-oid="f96smv9">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4" data-oid="_t6sobi">
                            Die Top 10 IT-Dienstleister 2024
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-oid="7i-z18p">
                            Basierend auf Marktanteil, Kundenzufriedenheit und technischer Expertise
                        </p>
                    </div>

                    <div className="grid gap-6" data-oid="vk4-t:5">
                        {itServices.map((company, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                data-oid="oa4.1x6"
                            >
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="dikr83v"
                                >
                                    <div className="flex items-center space-x-4" data-oid="fu10ofg">
                                        <div
                                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                                            data-oid="_xyb4gx"
                                        >
                                            {index + 1}
                                        </div>
                                        <div data-oid="7cpug9b">
                                            <h3
                                                className="text-xl font-semibold text-gray-900"
                                                data-oid="uzf-8b0"
                                            >
                                                {company.name}
                                            </h3>
                                            <div
                                                className="flex items-center space-x-4 text-sm text-gray-600 mt-1"
                                                data-oid="eb9j3q1"
                                            >
                                                <span
                                                    className="flex items-center"
                                                    data-oid="dpox7_m"
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-1"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        data-oid="-okm9ss"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                            clipRule="evenodd"
                                                            data-oid="x1zsmu:"
                                                        />
                                                    </svg>
                                                    {company.location}
                                                </span>
                                                <span
                                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                                    data-oid="79nb-jz"
                                                >
                                                    {company.specialty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right" data-oid="dn86mam">
                                        <div
                                            className="flex items-center space-x-1 mb-1"
                                            data-oid="hky7-cp"
                                        >
                                            <span
                                                className="text-2xl font-bold text-gray-900"
                                                data-oid="pxol01x"
                                            >
                                                {company.rating}
                                            </span>
                                            <svg
                                                className="w-5 h-5 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                data-oid=":ys795z"
                                            >
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                    data-oid="p-c7imx"
                                                />
                                            </svg>
                                        </div>
                                        <div className="text-sm text-gray-500" data-oid="z:d754n">
                                            Bewertung
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-white" data-oid="472l93u">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="u55ecw8">
                    <div className="text-center mb-16" data-oid="qrrrxk2">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4" data-oid="6y60efw">
                            IT-Dienstleistungen im Überblick
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-oid="q8syp9m">
                            Von Cloud-Migration bis zur digitalen Transformation
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-oid="xo0_fqv">
                        <div
                            className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"
                            data-oid="a8ztbh9"
                        >
                            <div
                                className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4"
                                data-oid="h702nu3"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="q_3mtk4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                                        data-oid="1l924pq"
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-xl font-semibold text-gray-900 mb-3"
                                data-oid="nniv_hi"
                            >
                                Cloud Services
                            </h3>
                            <p className="text-gray-600" data-oid="4yqepdv">
                                Migration, Hosting und Management von Cloud-Infrastrukturen
                            </p>
                        </div>

                        <div
                            className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
                            data-oid="n8q6rp2"
                        >
                            <div
                                className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4"
                                data-oid="_:k7gjt"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="e8jpzf0"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        data-oid="9_rx5s1"
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-xl font-semibold text-gray-900 mb-3"
                                data-oid="eh_w_kx"
                            >
                                Cybersecurity
                            </h3>
                            <p className="text-gray-600" data-oid="y7.dv4-">
                                Schutz vor Cyberbedrohungen und Sicherheitslösungen
                            </p>
                        </div>

                        <div
                            className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
                            data-oid="7k9lnph"
                        >
                            <div
                                className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4"
                                data-oid="p8jr6ja"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="g0jccu2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                        data-oid="zo1904e"
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-xl font-semibold text-gray-900 mb-3"
                                data-oid="qgh.231"
                            >
                                Digitale Transformation
                            </h3>
                            <p className="text-gray-600" data-oid="j2sdlb2">
                                Modernisierung von Geschäftsprozessen und Technologien
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
                data-oid="tubqzls"
            >
                <div
                    className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
                    data-oid="7ciyq14"
                >
                    <h2 className="text-4xl font-bold text-white mb-6" data-oid="5u2qutd">
                        Finden Sie den perfekten IT-Partner
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto" data-oid="lh:u-0r">
                        Kontaktieren Sie uns für eine kostenlose Beratung und finden Sie den idealen
                        IT-Dienstleister für Ihr Unternehmen.
                    </p>
                    <button
                        className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                        data-oid="fyzhep7"
                    >
                        Kostenlose Beratung anfragen
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12" data-oid="6a57bw0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="gj:r06o">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8" data-oid="3tw5ebw">
                        <div data-oid="zob:aok">
                            <div className="flex items-center space-x-2 mb-4" data-oid="un9.4ai">
                                <div
                                    className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
                                    data-oid="jq2coq_"
                                >
                                    <span
                                        className="text-white font-bold text-sm"
                                        data-oid="i8c3vpe"
                                    >
                                        IT
                                    </span>
                                </div>
                                <span className="text-xl font-semibold" data-oid="69lj33w">
                                    IT-Ranking Deutschland
                                </span>
                            </div>
                            <p className="text-gray-400" data-oid=":skd99_">
                                Die führende Plattform für IT-Dienstleister Rankings in Deutschland.
                            </p>
                        </div>
                        <div data-oid="tam0xfz">
                            <h4 className="font-semibold mb-4" data-oid="72g.jvs">
                                Services
                            </h4>
                            <ul className="space-y-2 text-gray-400" data-oid="18j0on:">
                                <li data-oid="ibyn.34">
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                        data-oid="q8xd0cq"
                                    >
                                        Rankings
                                    </a>
                                </li>
                                <li data-oid=".5splx5">
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                        data-oid="6fcmobd"
                                    >
                                        Bewertungen
                                    </a>
                                </li>
                                <li data-oid="i-z.cxp">
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                        data-oid="l.cy3bw"
                                    >
                                        Vergleiche
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div data-oid="qbp2xkw">
                            <h4 className="font-semibold mb-4" data-oid="3whw7ng">
                                Unternehmen
                            </h4>
                            <ul className="space-y-2 text-gray-400" data-oid="p_ie_kd">
                                <li data-oid="ljbm5zl">
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                        data-oid="t2lz72:"
                                    >
                                        Über uns
                                    </a>
                                </li>
                                <li data-oid="p_:n:0w">
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                        data-oid="nng:n3_"
                                    >
                                        Karriere
                                    </a>
                                </li>
                                <li data-oid="hrrbdx3">
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                        data-oid="zj9c0-3"
                                    >
                                        Presse
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div data-oid="udwi0:6">
                            <h4 className="font-semibold mb-4" data-oid="1x6de6e">
                                Kontakt
                            </h4>
                            <ul className="space-y-2 text-gray-400" data-oid="i0zx-i6">
                                <li data-oid="fcwio0f">info@it-ranking.de</li>
                                <li data-oid=":difkdn">+49 30 12345678</li>
                                <li data-oid="yi86bav">Berlin, Deutschland</li>
                            </ul>
                        </div>
                    </div>
                    <div
                        className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
                        data-oid="c94_-hn"
                    >
                        <p data-oid="5gtzpt9">
                            &copy; 2024 IT-Ranking Deutschland. Alle Rechte vorbehalten.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
