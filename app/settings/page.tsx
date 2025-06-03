'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Settings() {
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [apiProvider, setApiProvider] = useState('openai');
    const [apiKey, setApiKey] = useState('');
    const [prompt, setPrompt] = useState(
        'Analysiere die Top 10 IT-Dienstleister in Deutschland basierend auf Marktanteil, Kundenzufriedenheit und technischer Expertise.',
    );
    const [isSaving, setIsSaving] = useState(false);
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

        // Load saved settings
        const savedProvider = localStorage.getItem('apiProvider');
        const savedApiKey = localStorage.getItem('apiKey');
        const savedPrompt = localStorage.getItem('customPrompt');

        if (savedProvider) setApiProvider(savedProvider);
        if (savedApiKey) setApiKey(savedApiKey);
        if (savedPrompt) setPrompt(savedPrompt);

        setIsLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    const handleSaveSettings = () => {
        setIsSaving(true);

        // Save settings to localStorage
        localStorage.setItem('apiProvider', apiProvider);
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('customPrompt', prompt);

        setTimeout(() => {
            setIsSaving(false);
            alert('Einstellungen erfolgreich gespeichert!');
        }, 1000);
    };

    const goToDashboard = () => {
        router.push('/dashboard');
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="ncmnw43"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="nnlslpd"
                ></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="rzbd-s0">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid=".ccltqp">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="yqdv-l5">
                    <div className="flex justify-between items-center py-4" data-oid="3zi.:.4">
                        <div className="flex items-center space-x-3" data-oid="dua8e50">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="7woqtkd"
                            >
                                <span className="text-white font-bold text-lg" data-oid="os.k:nv">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="ags082s">
                                Einstellungen
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="vgo4ipa">
                            <button
                                onClick={goToDashboard}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                data-oid="is4-x_4"
                            >
                                Dashboard
                            </button>
                            <span className="text-gray-600" data-oid="k24iac4">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="g2okwvp"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="aqridep">
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
                    data-oid="0e3gsn_"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6" data-oid="ryf04my">
                        AI-Einstellungen
                    </h2>

                    <div className="space-y-6" data-oid="alv5l_:">
                        {/* API Provider Selection */}
                        <div data-oid="a2354.v">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="t431wnb"
                            >
                                AI-Anbieter
                            </label>
                            <select
                                value={apiProvider}
                                onChange={(e) => setApiProvider(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                data-oid=":j:1ifm"
                            >
                                <option value="openai" data-oid="ue0m7t3">
                                    OpenAI
                                </option>
                                <option value="openrouter" data-oid="h3mvbbt">
                                    OpenRouter
                                </option>
                                <option value="deepseek" data-oid="pwdhl3w">
                                    DeepSeek
                                </option>
                            </select>
                        </div>

                        {/* API Key */}
                        <div data-oid="v:m:wlm">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="h.1dllp"
                            >
                                API-Schlüssel
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Geben Sie Ihren API-Schlüssel ein"
                                data-oid="9gsms9z"
                            />

                            <p className="text-sm text-gray-500 mt-1" data-oid="t-woc0l">
                                Ihr API-Schlüssel wird sicher lokal gespeichert
                            </p>
                        </div>

                        {/* Custom Prompt */}
                        <div data-oid="2q0-hxc">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="94.wz5v"
                            >
                                Benutzerdefinierter Prompt
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Geben Sie Ihren benutzerdefinierten Prompt ein"
                                data-oid="tuhbcgm"
                            />

                            <p className="text-sm text-gray-500 mt-1" data-oid="97h499c">
                                Dieser Prompt wird für die Analyse der IT-Dienstleister verwendet
                            </p>
                        </div>

                        {/* Provider Information */}
                        <div
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                            data-oid="1ah2o_k"
                        >
                            <h3 className="font-medium text-blue-900 mb-2" data-oid="nhyg9zi">
                                Anbieter-Informationen
                            </h3>
                            <div className="text-sm text-blue-700 space-y-1" data-oid="e27ivdf">
                                {apiProvider === 'openai' && (
                                    <>
                                        <p data-oid="y8gng69">• OpenAI GPT-4 und GPT-3.5 Modelle</p>
                                        <p data-oid="_mc_h1f">• Hohe Qualität für Textanalyse</p>
                                        <p data-oid="h7y3fm7">
                                            • API-Schlüssel von platform.openai.com
                                        </p>
                                    </>
                                )}
                                {apiProvider === 'openrouter' && (
                                    <>
                                        <p data-oid="20g6bn5">
                                            • Zugang zu verschiedenen AI-Modellen
                                        </p>
                                        <p data-oid=":93b2t:">• Flexible Preisgestaltung</p>
                                        <p data-oid="-e14voo">• API-Schlüssel von openrouter.ai</p>
                                    </>
                                )}
                                {apiProvider === 'deepseek' && (
                                    <>
                                        <p data-oid="vjuv-ej">• DeepSeek AI-Modelle</p>
                                        <p data-oid="z0.gypq">• Kostengünstige Alternative</p>
                                        <p data-oid="4kifuzc">
                                            • API-Schlüssel von platform.deepseek.com
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end" data-oid="ns2echk">
                            <button
                                onClick={handleSaveSettings}
                                disabled={isSaving}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="8dlmhv6"
                            >
                                {isSaving ? (
                                    <div className="flex items-center" data-oid="v:4j8s7">
                                        <div
                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                            data-oid="z5_gn2s"
                                        ></div>
                                        Speichern...
                                    </div>
                                ) : (
                                    'Einstellungen speichern'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
