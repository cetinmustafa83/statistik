'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Check for admin credentials
        setTimeout(() => {
            if (email === 'admin' && password === 'admin') {
                // Store login state in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                router.push('/dashboard');
            } else {
                alert('Ungültige Anmeldedaten! Bitte verwenden Sie: admin / admin');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
            data-oid="sc9bs.d"
        >
            <div className="max-w-md w-full space-y-8" data-oid="21m38zs">
                <div className="text-center" data-oid="tswt3kw">
                    <div className="flex justify-center mb-6" data-oid="xcxjn6z">
                        <div
                            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center"
                            data-oid="2o_o8rb"
                        >
                            <span className="text-white font-bold text-2xl" data-oid="to20p0a">
                                IT
                            </span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2" data-oid="r71uz8k">
                        Anmelden
                    </h2>
                    <p className="text-gray-600" data-oid="sdbmgeo">
                        Melden Sie sich an, um auf das Dashboard zuzugreifen
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8" data-oid="rag3uvm">
                    <form onSubmit={handleLogin} className="space-y-6" data-oid=":zb2qa4">
                        <div data-oid="rdnm49b">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="khy7ia3"
                            >
                                Benutzername
                            </label>
                            <input
                                id="email"
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="admin"
                                data-oid="ph:2xmi"
                            />
                        </div>

                        <div data-oid="ydnv18z">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="k9ho4.9"
                            >
                                Passwort
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="admin"
                                data-oid="q8akqb_"
                            />
                        </div>

                        <div className="flex items-center justify-between" data-oid="mqwa_k5">
                            <div className="flex items-center" data-oid="eyvqjp3">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    data-oid="d4tvv4d"
                                />

                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                    data-oid="j3x9p.a"
                                >
                                    Angemeldet bleiben
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-500"
                                data-oid="ul050y2"
                            >
                                Passwort vergessen
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="j1-69mt"
                        >
                            {isLoading ? (
                                <div
                                    className="flex items-center justify-center"
                                    data-oid="fp.r36z"
                                >
                                    <div
                                        className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                        data-oid="6lv_7.a"
                                    ></div>
                                    Anmeldung läuft...
                                </div>
                            ) : (
                                'Anmelden'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center" data-oid="i0.qrfh">
                        <p className="text-sm text-gray-600" data-oid="dllybl3">
                            Noch kein Konto?{' '}
                            <a
                                href="#"
                                className="text-blue-600 hover:text-blue-500 font-medium"
                                data-oid="nfjfzul"
                            >
                                Registrieren
                            </a>
                        </p>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500" data-oid="a6maqx_">
                    <p data-oid="2:ekecy">
                        Verwenden Sie: <strong data-oid="9k6_q2h">admin</strong> /{' '}
                        <strong data-oid="-e9up2x">admin</strong> für die Anmeldung
                    </p>
                </div>
            </div>
        </div>
    );
}
