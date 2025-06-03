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
            data-oid="0md1sob"
        >
            <div className="max-w-md w-full space-y-8" data-oid="on5tez5">
                <div className="text-center" data-oid="jualw4l">
                    <div className="flex justify-center mb-6" data-oid="_-k.745">
                        <div
                            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center"
                            data-oid="kjdmsj-"
                        >
                            <span className="text-white font-bold text-2xl" data-oid="lh:.ozo">
                                IT
                            </span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2" data-oid="cf9b2lv">
                        Anmelden
                    </h2>
                    <p className="text-gray-600" data-oid="099f642">
                        Melden Sie sich an, um auf das Dashboard zuzugreifen
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8" data-oid="gjc7g8m">
                    <form onSubmit={handleLogin} className="space-y-6" data-oid="y846ldp">
                        <div data-oid=".t1372i">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="aegt7g:"
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
                                data-oid="6pejdta"
                            />
                        </div>

                        <div data-oid="1.7ww2_">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="3ea0wfq"
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
                                data-oid="9d0n_ob"
                            />
                        </div>

                        <div className="flex items-center justify-between" data-oid="h_cm54w">
                            <div className="flex items-center" data-oid="xmc56-h">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    data-oid="d1vxy86"
                                />

                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                    data-oid="pvj.b.z"
                                >
                                    Angemeldet bleiben
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-500"
                                data-oid="16ch310"
                            >
                                Passwort vergessen
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="hzcoiav"
                        >
                            {isLoading ? (
                                <div
                                    className="flex items-center justify-center"
                                    data-oid="vjsg3qr"
                                >
                                    <div
                                        className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                        data-oid="d0kg7ts"
                                    ></div>
                                    Anmeldung läuft...
                                </div>
                            ) : (
                                'Anmelden'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center" data-oid="ijlry_k">
                        <p className="text-sm text-gray-600" data-oid="tl0q10e">
                            Noch kein Konto?{' '}
                            <a
                                href="#"
                                className="text-blue-600 hover:text-blue-500 font-medium"
                                data-oid="8r8066t"
                            >
                                Registrieren
                            </a>
                        </p>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500" data-oid="g6qct87">
                    <p data-oid="w559a3a">
                        Verwenden Sie: <strong data-oid="v-0p-.:">admin</strong> /{' '}
                        <strong data-oid="xzujugm">admin</strong> für die Anmeldung
                    </p>
                </div>
            </div>
        </div>
    );
}
