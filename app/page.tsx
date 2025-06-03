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
            data-oid="-8o4re_"
        >
            <div className="max-w-md w-full space-y-8" data-oid="eqbqmnd">
                <div className="text-center" data-oid="5b2x-hl">
                    <div className="flex justify-center mb-6" data-oid="p3eu1pk">
                        <div
                            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center"
                            data-oid="u8157f5"
                        >
                            <span className="text-white font-bold text-2xl" data-oid="-idj_pk">
                                IT
                            </span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2" data-oid=".djik28">
                        Anmelden
                    </h2>
                    <p className="text-gray-600" data-oid="q8ug-mf">
                        Melden Sie sich an, um auf das Dashboard zuzugreifen
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8" data-oid="74g7gof">
                    <form onSubmit={handleLogin} className="space-y-6" data-oid="ja78by4">
                        <div data-oid="h-6xex.">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="w9hy:xf"
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
                                data-oid="4bf4:mw"
                            />
                        </div>

                        <div data-oid="p9bwvcy">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="lcv_tmz"
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
                                data-oid="3a5lfpu"
                            />
                        </div>

                        <div className="flex items-center justify-between" data-oid="-0jyjhs">
                            <div className="flex items-center" data-oid="vrh9i7j">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    data-oid="z72ay3z"
                                />

                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                    data-oid="o5vyxv0"
                                >
                                    Angemeldet bleiben
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-500"
                                data-oid="_lrk5du"
                            >
                                Passwort vergessen
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="g:g89be"
                        >
                            {isLoading ? (
                                <div
                                    className="flex items-center justify-center"
                                    data-oid="jrt0j2u"
                                >
                                    <div
                                        className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                        data-oid="vj0tvsp"
                                    ></div>
                                    Anmeldung läuft...
                                </div>
                            ) : (
                                'Anmelden'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center" data-oid="7m..gd0">
                        <p className="text-sm text-gray-600" data-oid="j45ima6">
                            Noch kein Konto?{' '}
                            <a
                                href="#"
                                className="text-blue-600 hover:text-blue-500 font-medium"
                                data-oid="_-n4jml"
                            >
                                Registrieren
                            </a>
                        </p>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500" data-oid="hgtc4n9">
                    <p data-oid="v0skp_y">
                        Verwenden Sie: <strong data-oid="e.d-0u8">admin</strong> /{' '}
                        <strong data-oid="3mhhjlh">admin</strong> für die Anmeldung
                    </p>
                </div>
            </div>
        </div>
    );
}
