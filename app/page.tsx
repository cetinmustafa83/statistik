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
            data-oid="ivdlude"
        >
            <div className="max-w-md w-full space-y-8" data-oid="-4p3z60">
                <div className="text-center" data-oid="8w6jts_">
                    <div className="flex justify-center mb-6" data-oid="943b9.4">
                        <div
                            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center"
                            data-oid="9gx._._"
                        >
                            <span className="text-white font-bold text-2xl" data-oid="5kwuk2m">
                                IT
                            </span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2" data-oid="1-8wh3q">
                        Anmelden
                    </h2>
                    <p className="text-gray-600" data-oid="gs5288b">
                        Melden Sie sich an, um auf das Dashboard zuzugreifen
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8" data-oid="0_f_31o">
                    <form onSubmit={handleLogin} className="space-y-6" data-oid="drva3gi">
                        <div data-oid="6yrj8o2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="f16xba9"
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
                                data-oid="k0lt-8:"
                            />
                        </div>

                        <div data-oid="97haqi5">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="a9rnoic"
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
                                data-oid="2544i3u"
                            />
                        </div>

                        <div className="flex items-center justify-between" data-oid="yc16n:-">
                            <div className="flex items-center" data-oid="9tpdvih">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    data-oid="42scpmy"
                                />

                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                    data-oid="xdoddav"
                                >
                                    Angemeldet bleiben
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-500"
                                data-oid="jgk1d4."
                            >
                                Passwort vergessen
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="1aas1d8"
                        >
                            {isLoading ? (
                                <div
                                    className="flex items-center justify-center"
                                    data-oid="7p2.k8p"
                                >
                                    <div
                                        className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                        data-oid="uzxlkia"
                                    ></div>
                                    Anmeldung läuft...
                                </div>
                            ) : (
                                'Anmelden'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center" data-oid="oz:an7t">
                        <p className="text-sm text-gray-600" data-oid="2:foj3j">
                            Noch kein Konto?{' '}
                            <a
                                href="#"
                                className="text-blue-600 hover:text-blue-500 font-medium"
                                data-oid="vi93dkn"
                            >
                                Registrieren
                            </a>
                        </p>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500" data-oid="m9kl_rl">
                    <p data-oid="qvcd9oc">
                        Verwenden Sie: <strong data-oid="vsifhoa">admin</strong> /{' '}
                        <strong data-oid=".eerurr">admin</strong> für die Anmeldung
                    </p>
                </div>
            </div>
        </div>
    );
}
