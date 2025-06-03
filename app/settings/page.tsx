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
                data-oid="dwy2ajp"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="0jyuocb"
                ></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="tubt.zj">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="32a6woz">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="7tqgsjc">
                    <div className="flex justify-between items-center py-4" data-oid="1ahu22g">
                        <div className="flex items-center space-x-3" data-oid="5ko1_u8">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="alya15j"
                            >
                                <span className="text-white font-bold text-lg" data-oid="ucv1zi1">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="tgr8xu-">
                                Einstellungen
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid="zc2dktr">
                            <button
                                onClick={goToDashboard}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                data-oid="cfl6bhv"
                            >
                                Dashboard
                            </button>
                            <span className="text-gray-600" data-oid="zfozscy">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="ogfho_p"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="tz:24sy">
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
                    data-oid="deruo_1"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6" data-oid="p_imxye">
                        AI-Einstellungen
                    </h2>

                    <div className="space-y-6" data-oid="52b5_kf">
                        {/* API Provider Selection */}
                        <div data-oid="6_txmcz">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="jb5falh"
                            >
                                AI-Anbieter
                            </label>
                            <select
                                value={apiProvider}
                                onChange={(e) => handleProviderChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                data-oid="pmy61o3"
                            >
                                <option value="openai" data-oid="ct:dw6b">
                                    OpenAI
                                </option>
                                <option value="openrouter" data-oid="vls8aso">
                                    OpenRouter (Kostenlose Modelle)
                                </option>
                                <option value="deepseek" data-oid="7eik:g1">
                                    DeepSeek
                                </option>
                            </select>
                        </div>

                        {/* API Key */}
                        <div data-oid="5-m69iy">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="zp4_k5h"
                            >
                                API-Schlüssel
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => handleApiKeyChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Geben Sie Ihren API-Schlüssel ein"
                                data-oid="9wyv_rt"
                            />

                            <p className="text-sm text-gray-500 mt-1" data-oid="pcpf545">
                                Ihr API-Schlüssel wird sicher lokal gespeichert
                                {apiProvider === 'openrouter' &&
                                    ' • Modelle werden automatisch geladen'}
                            </p>
                        </div>

                        {/* Model Selection */}
                        <div data-oid=":orm5o4">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="8-fc6fo"
                            >
                                AI-Modell
                            </label>

                            {isLoadingModels ? (
                                <div
                                    className="flex items-center justify-center py-8 border border-gray-300 rounded-lg"
                                    data-oid="-onymqo"
                                >
                                    <div
                                        className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"
                                        data-oid="u9l5vrz"
                                    ></div>
                                    <span className="text-gray-600" data-oid="wwdsrt0">
                                        Modelle werden geladen...
                                    </span>
                                </div>
                            ) : availableModels.length > 0 ? (
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    data-oid=".:kbqud"
                                >
                                    <option value="" data-oid="xh.r:0l">
                                        Modell auswählen
                                    </option>
                                    {availableModels.map((model) => (
                                        <option key={model.id} value={model.id} data-oid="py3:s3-">
                                            {model.name}
                                            {model.free && ' (Kostenlos)'}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                    data-oid="y6x:i38"
                                >
                                    {apiProvider === 'openrouter' && !apiKey
                                        ? 'API-Schlüssel eingeben um Modelle zu laden'
                                        : 'Keine Modelle verfügbar'}
                                </div>
                            )}

                            {selectedModel && availableModels.length > 0 && (
                                <div
                                    className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                    data-oid="z8jkr8x"
                                >
                                    {(() => {
                                        const model = availableModels.find(
                                            (m) => m.id === selectedModel,
                                        );
                                        return model ? (
                                            <div
                                                className="text-sm text-blue-700"
                                                data-oid="hn-_94q"
                                            >
                                                <p className="font-medium" data-oid="yhcjfwu">
                                                    {model.name}
                                                </p>
                                                {model.description && (
                                                    <p className="mt-1" data-oid="8g:w0kh">
                                                        {model.description}
                                                    </p>
                                                )}
                                                {model.free && (
                                                    <p
                                                        className="mt-1 text-green-600 font-medium"
                                                        data-oid=".tp9v:w"
                                                    >
                                                        ✓ Kostenloses Modell
                                                    </p>
                                                )}
                                                {model.context_length && (
                                                    <p
                                                        className="mt-1 text-gray-600"
                                                        data-oid="dbl_-cb"
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

                            <p className="text-sm text-gray-500 mt-1" data-oid="jv-_qku">
                                {apiProvider === 'openrouter'
                                    ? 'Nur kostenlose Modelle werden angezeigt'
                                    : 'Wählen Sie das gewünschte AI-Modell für die Analyse'}
                            </p>
                        </div>

                        {/* Custom Prompt */}
                        <div data-oid="-n41mjj">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="dm5.6xz"
                            >
                                Benutzerdefinierter Prompt
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Geben Sie Ihren benutzerdefinierten Prompt ein"
                                data-oid="9rjltvf"
                            />

                            <p className="text-sm text-gray-500 mt-1" data-oid="2ec.667">
                                Dieser Prompt wird für die Analyse der IT-Dienstleister verwendet
                            </p>
                        </div>

                        {/* Provider Information */}
                        <div
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                            data-oid="tl6edy-"
                        >
                            <h3 className="font-medium text-blue-900 mb-2" data-oid="yfopjoq">
                                Anbieter-Informationen
                            </h3>
                            <div className="text-sm text-blue-700 space-y-1" data-oid=":9y7-1s">
                                {apiProvider === 'openai' && (
                                    <>
                                        <p data-oid="wwx-25e">• OpenAI GPT-4 und GPT-3.5 Modelle</p>
                                        <p data-oid="f_ihyqt">• Hohe Qualität für Textanalyse</p>
                                        <p data-oid=".kwlxaw">
                                            • API-Schlüssel von platform.openai.com
                                        </p>
                                    </>
                                )}
                                {apiProvider === 'openrouter' && (
                                    <>
                                        <p data-oid="p.6rwj7">
                                            • Zugang zu kostenlosen AI-Modellen
                                        </p>
                                        <p data-oid="29gt5tj">• Llama, Mistral, Qwen und andere</p>
                                        <p data-oid="25iissp">• API-Schlüssel von openrouter.ai</p>
                                        <p data-oid="0jqqvqf">
                                            • Automatische Erkennung kostenloser Modelle
                                        </p>
                                    </>
                                )}
                                {apiProvider === 'deepseek' && (
                                    <>
                                        <p data-oid="o1.t.zn">• DeepSeek AI-Modelle</p>
                                        <p data-oid="1d1ph14">• Kostengünstige Alternative</p>
                                        <p data-oid="eg5wt8o">
                                            • API-Schlüssel von platform.deepseek.com
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center" data-oid="l7ffkff">
                            <div className="flex space-x-3" data-oid="b95djmx">
                                <button
                                    onClick={handleTestConnection}
                                    disabled={isLoadingModels || !apiKey}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="iks7tgd"
                                >
                                    {isLoadingModels ? (
                                        <div className="flex items-center" data-oid="axd56d9">
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                                data-oid="6rpab1:"
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
                                    data-oid="qnu-wv5"
                                >
                                    {isLoadingModels ? (
                                        <div className="flex items-center" data-oid="n62:djj">
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                                data-oid="m:p.5ks"
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
                                data-oid="wg_v:d2"
                            >
                                {isSaving ? (
                                    <div className="flex items-center" data-oid="thocfqw">
                                        <div
                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                            data-oid="vf5m6ip"
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
