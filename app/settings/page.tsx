'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { aiService } from '../../lib/aiService';
import { AIModel } from '../../lib/database';
import { useToast } from '../../lib/toast';

export default function Settings() {
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [apiProvider, setApiProvider] = useState('openai');
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [prompt, setPrompt] = useState(
        'Analysiere die Top 10 IT-Dienstleister in Deutschland basierend auf Marktanteil, Kundenzufriedenheit und technischer Expertise.',
    );
    const [isSaving, setIsSaving] = useState(false);
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

        // Load saved settings
        const savedProvider = localStorage.getItem('apiProvider');
        const savedApiKey = localStorage.getItem('apiKey');
        const savedModel = localStorage.getItem('selectedModel');
        const savedPrompt = localStorage.getItem('customPrompt');

        if (savedProvider) {
            setApiProvider(savedProvider);
            // Load models for the saved provider
            loadModelsForProvider(savedProvider, savedApiKey);
        }
        if (savedApiKey) setApiKey(savedApiKey);
        if (savedModel) setSelectedModel(savedModel);
        if (savedPrompt) setPrompt(savedPrompt);

        setIsLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    const loadModelsForProvider = async (provider: string, key?: string) => {
        setIsLoadingModels(true);
        try {
            const models = await aiService.getModelsForProvider(provider, key);
            setAvailableModels(models);

            // Auto-select first model if none selected
            if (models.length > 0 && !selectedModel) {
                setSelectedModel(models[0].id);
            }
        } catch (error) {
            console.error('Error loading models:', error);
            addToast({
                type: 'error',
                title: 'Fehler beim Laden der Modelle',
                message:
                    'Modelle konnten nicht geladen werden. Bitte überprüfen Sie Ihren API-Schlüssel.',
            });
        } finally {
            setIsLoadingModels(false);
        }
    };

    const handleProviderChange = (provider: string) => {
        setApiProvider(provider);
        setSelectedModel('');
        setAvailableModels([]);

        // Load models for new provider
        if (provider !== 'openrouter' || apiKey) {
            loadModelsForProvider(provider, apiKey);
        }
    };

    const handleApiKeyChange = (key: string) => {
        setApiKey(key);

        // If OpenRouter and key is provided, fetch models
        if (apiProvider === 'openrouter' && key.trim()) {
            loadModelsForProvider(apiProvider, key);
        }
    };

    const handleSaveSettings = () => {
        if (!selectedModel && availableModels.length > 0) {
            addToast({
                type: 'warning',
                title: 'Modell auswählen',
                message: 'Bitte wählen Sie ein AI-Modell aus.',
            });
            return;
        }

        if (!apiKey.trim()) {
            addToast({
                type: 'warning',
                title: 'API-Schlüssel erforderlich',
                message: 'Bitte geben Sie einen gültigen API-Schlüssel ein.',
            });
            return;
        }

        if (!prompt.trim()) {
            addToast({
                type: 'warning',
                title: 'Prompt erforderlich',
                message: 'Bitte geben Sie einen Prompt für die AI-Analyse ein.',
            });
            return;
        }

        setIsSaving(true);

        // Save settings to localStorage (for UI state)
        localStorage.setItem('apiProvider', apiProvider);
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('selectedModel', selectedModel);
        localStorage.setItem('customPrompt', prompt);

        // Save to database (for AI service)
        const { db } = require('../../lib/database');
        db.saveAPISettings({
            provider: apiProvider as 'openai' | 'openrouter' | 'deepseek',
            apiKey: apiKey,
            model: selectedModel,
            prompt: prompt,
        });

        setTimeout(() => {
            setIsSaving(false);
            addToast({
                type: 'success',
                title: 'Einstellungen gespeichert',
                message: 'Ihre AI-Einstellungen wurden erfolgreich gespeichert!',
            });
        }, 1000);
    };

    const handleTestConnection = async () => {
        if (!apiKey.trim()) {
            addToast({
                type: 'warning',
                title: 'API-Schlüssel erforderlich',
                message: 'Bitte geben Sie einen API-Schlüssel ein, um die Verbindung zu testen.',
            });
            return;
        }

        setIsLoadingModels(true);
        try {
            const models = await aiService.getModelsForProvider(apiProvider, apiKey);
            if (models.length > 0) {
                addToast({
                    type: 'success',
                    title: 'Verbindung erfolgreich',
                    message: `${models.length} Modelle gefunden für ${apiProvider}`,
                });
                setAvailableModels(models);
                if (!selectedModel) {
                    setSelectedModel(models[0].id);
                }
            } else {
                addToast({
                    type: 'warning',
                    title: 'Keine Modelle gefunden',
                    message: 'Es konnten keine verfügbaren Modelle gefunden werden.',
                });
            }
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Verbindungsfehler',
                message: 'Die Verbindung zum AI-Provider konnte nicht hergestellt werden.',
            });
        } finally {
            setIsLoadingModels(false);
        }
    };

    const goToDashboard = () => {
        router.push('/dashboard');
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="m:wecou"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="zarxzf4"
                ></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="tfp-ymc">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="b_nv:9z">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="yzpeoob">
                    <div className="flex justify-between items-center py-4" data-oid="qx62n24">
                        <div className="flex items-center space-x-3" data-oid="-efentp">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="gyspo36"
                            >
                                <span className="text-white font-bold text-lg" data-oid="g_6_:g8">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="._ul_ey">
                                Einstellungen
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="rni67oy">
                            <button
                                onClick={goToDashboard}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                data-oid="oo149u:"
                            >
                                Dashboard
                            </button>
                            <span className="text-gray-600" data-oid="ev00uab">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="o3j2tal"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="058-4-.">
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
                    data-oid="be.hylx"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6" data-oid="logkzhd">
                        AI-Einstellungen
                    </h2>

                    <div className="space-y-6" data-oid="tnynw55">
                        {/* API Provider Selection */}
                        <div data-oid="cjtb64t">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="2n0gx.d"
                            >
                                AI-Anbieter
                            </label>
                            <select
                                value={apiProvider}
                                onChange={(e) => handleProviderChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                data-oid="-8iixt0"
                            >
                                <option value="openai" data-oid="dtf_x-_">
                                    OpenAI
                                </option>
                                <option value="openrouter" data-oid="gvy31-2">
                                    OpenRouter (Kostenlose Modelle)
                                </option>
                                <option value="deepseek" data-oid="f:89mxr">
                                    DeepSeek
                                </option>
                            </select>
                        </div>

                        {/* API Key */}
                        <div data-oid="c5qaigl">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="rmnr96."
                            >
                                API-Schlüssel
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => handleApiKeyChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Geben Sie Ihren API-Schlüssel ein"
                                data-oid="i2-_2.f"
                            />

                            <p className="text-sm text-gray-500 mt-1" data-oid="wlt:rqv">
                                Ihr API-Schlüssel wird sicher lokal gespeichert
                                {apiProvider === 'openrouter' &&
                                    ' • Modelle werden automatisch geladen'}
                            </p>
                        </div>

                        {/* Model Selection */}
                        <div data-oid="8pce561">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="-loilnl"
                            >
                                AI-Modell
                            </label>

                            {isLoadingModels ? (
                                <div
                                    className="flex items-center justify-center py-8 border border-gray-300 rounded-lg"
                                    data-oid="9e8w93z"
                                >
                                    <div
                                        className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"
                                        data-oid="nypxf:5"
                                    ></div>
                                    <span className="text-gray-600" data-oid="hivimg-">
                                        Modelle werden geladen...
                                    </span>
                                </div>
                            ) : availableModels.length > 0 ? (
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    data-oid="70w7-dm"
                                >
                                    <option value="" data-oid="6:1pc1b">
                                        Modell auswählen
                                    </option>
                                    {availableModels.map((model) => (
                                        <option key={model.id} value={model.id} data-oid="wrg4k85">
                                            {model.name}
                                            {model.free && ' (Kostenlos)'}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                    data-oid="967o220"
                                >
                                    {apiProvider === 'openrouter' && !apiKey
                                        ? 'API-Schlüssel eingeben um Modelle zu laden'
                                        : 'Keine Modelle verfügbar'}
                                </div>
                            )}

                            {selectedModel && availableModels.length > 0 && (
                                <div
                                    className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                    data-oid="b8243m3"
                                >
                                    {(() => {
                                        const model = availableModels.find(
                                            (m) => m.id === selectedModel,
                                        );
                                        return model ? (
                                            <div
                                                className="text-sm text-blue-700"
                                                data-oid="7rw6484"
                                            >
                                                <p className="font-medium" data-oid="mja2a-7">
                                                    {model.name}
                                                </p>
                                                {model.description && (
                                                    <p className="mt-1" data-oid="6l38nm-">
                                                        {model.description}
                                                    </p>
                                                )}
                                                {model.free && (
                                                    <p
                                                        className="mt-1 text-green-600 font-medium"
                                                        data-oid="285zsx:"
                                                    >
                                                        ✓ Kostenloses Modell
                                                    </p>
                                                )}
                                                {model.context_length && (
                                                    <p
                                                        className="mt-1 text-gray-600"
                                                        data-oid="rmsl-vz"
                                                    >
                                                        Kontext:{' '}
                                                        {model.context_length.toLocaleString()}{' '}
                                                        Token
                                                    </p>
                                                )}
                                            </div>
                                        ) : null;
                                    })()}
                                </div>
                            )}

                            <p className="text-sm text-gray-500 mt-1" data-oid="0w7e-d0">
                                {apiProvider === 'openrouter'
                                    ? 'Nur kostenlose Modelle werden angezeigt'
                                    : 'Wählen Sie das gewünschte AI-Modell für die Analyse'}
                            </p>
                        </div>

                        {/* Custom Prompt */}
                        <div data-oid="oekvyff">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="3dtgyv1"
                            >
                                Benutzerdefinierter Prompt
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Geben Sie Ihren benutzerdefinierten Prompt ein"
                                data-oid="dshqltt"
                            />

                            <p className="text-sm text-gray-500 mt-1" data-oid="mp3caj5">
                                Dieser Prompt wird für die Analyse der IT-Dienstleister verwendet
                            </p>
                        </div>

                        {/* Provider Information */}
                        <div
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                            data-oid="5nv.lwg"
                        >
                            <h3 className="font-medium text-blue-900 mb-2" data-oid="8-:synj">
                                Anbieter-Informationen
                            </h3>
                            <div className="text-sm text-blue-700 space-y-1" data-oid="4zh0y8f">
                                {apiProvider === 'openai' && (
                                    <>
                                        <p data-oid="a..4zf.">• OpenAI GPT-4 und GPT-3.5 Modelle</p>
                                        <p data-oid="2brvz5y">• Hohe Qualität für Textanalyse</p>
                                        <p data-oid="itryiev">
                                            • API-Schlüssel von platform.openai.com
                                        </p>
                                    </>
                                )}
                                {apiProvider === 'openrouter' && (
                                    <>
                                        <p data-oid="7dpjrly">
                                            • Zugang zu kostenlosen AI-Modellen
                                        </p>
                                        <p data-oid="y4mm6wq">• Llama, Mistral, Qwen und andere</p>
                                        <p data-oid="ixqwf4u">• API-Schlüssel von openrouter.ai</p>
                                        <p data-oid="ynuwlfp">
                                            • Automatische Erkennung kostenloser Modelle
                                        </p>
                                    </>
                                )}
                                {apiProvider === 'deepseek' && (
                                    <>
                                        <p data-oid="7fgtomd">• DeepSeek AI-Modelle</p>
                                        <p data-oid="i4h1cdc">• Kostengünstige Alternative</p>
                                        <p data-oid="c1ze:hf">
                                            • API-Schlüssel von platform.deepseek.com
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center" data-oid="rbf.vmw">
                            <div className="flex space-x-3" data-oid="jbteu_6">
                                <button
                                    onClick={handleTestConnection}
                                    disabled={isLoadingModels || !apiKey}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="_v6zmvo"
                                >
                                    {isLoadingModels ? (
                                        <div className="flex items-center" data-oid="iz.-n8e">
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                                data-oid="qk.pw1v"
                                            ></div>
                                            Teste...
                                        </div>
                                    ) : (
                                        'Verbindung testen'
                                    )}
                                </button>

                                <button
                                    onClick={() => loadModelsForProvider(apiProvider, apiKey)}
                                    disabled={
                                        isLoadingModels || (apiProvider === 'openrouter' && !apiKey)
                                    }
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="wgyn598"
                                >
                                    {isLoadingModels ? (
                                        <div className="flex items-center" data-oid="2h::jo1">
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                                data-oid="x-k2:b1"
                                            ></div>
                                            Laden...
                                        </div>
                                    ) : (
                                        'Modelle aktualisieren'
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={handleSaveSettings}
                                disabled={isSaving}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="w__wg:9"
                            >
                                {isSaving ? (
                                    <div className="flex items-center" data-oid="i6003ig">
                                        <div
                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                            data-oid="fmf-a8j"
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
