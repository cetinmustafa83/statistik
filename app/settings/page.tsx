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
                data-oid="rrijiqu"
            >
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                    data-oid="8_yaj_6"
                ></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="qjmd1zh">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200" data-oid="d83nj1p">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="z7xajz5">
                    <div className="flex justify-between items-center py-4" data-oid="l.js9y4">
                        <div className="flex items-center space-x-3" data-oid="ene0l55">
                            <div
                                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                                data-oid="sbr_kly"
                            >
                                <span className="text-white font-bold text-lg" data-oid="z:50sk9">
                                    IT
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900" data-oid="623po1y">
                                Einstellungen
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4" data-oid=":o_dxwi">
                            <button
                                onClick={goToDashboard}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                data-oid="q9:tkxk"
                            >
                                Dashboard
                            </button>
                            <span className="text-gray-600" data-oid="atsdiob">
                                Willkommen, {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                data-oid="ja_fgho"
                            >
                                Abmelden
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="_habw_t">
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
                    data-oid="j.y2kmo"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6" data-oid="88v8h-e">
                        AI-Einstellungen
                    </h2>

                    <div className="space-y-6" data-oid="i2f63n2">
                        {/* API Provider Selection */}
                        <div data-oid="ug2quco">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid=".y4j-ts"
                            >
                                AI-Anbieter
                            </label>
                            <select
                                value={apiProvider}
                                onChange={(e) => handleProviderChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                data-oid="ellv9yv"
                            >
                                <option value="openai" data-oid="qr-qmps">
                                    OpenAI
                                </option>
                                <option value="openrouter" data-oid="jm7odpb">
                                    OpenRouter (Kostenlose Modelle)
                                </option>
                                <option value="deepseek" data-oid="4hah21-">
                                    DeepSeek
                                </option>
                            </select>
                        </div>

                        {/* API Key */}
                        <div data-oid="4.u_ny_">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="7ye02st"
                            >
                                API-Schlüssel
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => handleApiKeyChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Geben Sie Ihren API-Schlüssel ein"
                                data-oid="2bxvy0k"
                            />

                            <p className="text-sm text-gray-500 mt-1" data-oid="-8hw6nr">
                                Ihr API-Schlüssel wird sicher lokal gespeichert
                                {apiProvider === 'openrouter' &&
                                    ' • Modelle werden automatisch geladen'}
                            </p>
                        </div>

                        {/* Model Selection */}
                        <div data-oid="1knw4jc">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="2iuza9h"
                            >
                                AI-Modell
                            </label>

                            {isLoadingModels ? (
                                <div
                                    className="flex items-center justify-center py-8 border border-gray-300 rounded-lg"
                                    data-oid="mhph1kz"
                                >
                                    <div
                                        className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"
                                        data-oid="r99m4_j"
                                    ></div>
                                    <span className="text-gray-600" data-oid="jwhc8wd">
                                        Modelle werden geladen...
                                    </span>
                                </div>
                            ) : availableModels.length > 0 ? (
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    data-oid="7fo8mln"
                                >
                                    <option value="" data-oid="sep_xhh">
                                        Modell auswählen
                                    </option>
                                    {availableModels.map((model) => (
                                        <option key={model.id} value={model.id} data-oid="psw7ucq">
                                            {model.name}
                                            {model.free && ' (Kostenlos)'}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                    data-oid="yjmy2mk"
                                >
                                    {apiProvider === 'openrouter' && !apiKey
                                        ? 'API-Schlüssel eingeben um Modelle zu laden'
                                        : 'Keine Modelle verfügbar'}
                                </div>
                            )}

                            {selectedModel && availableModels.length > 0 && (
                                <div
                                    className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                    data-oid="mgmmgwk"
                                >
                                    {(() => {
                                        const model = availableModels.find(
                                            (m) => m.id === selectedModel,
                                        );
                                        return model ? (
                                            <div
                                                className="text-sm text-blue-700"
                                                data-oid="cl7jshu"
                                            >
                                                <p className="font-medium" data-oid=":rh1f4e">
                                                    {model.name}
                                                </p>
                                                {model.description && (
                                                    <p className="mt-1" data-oid="1qf:xyj">
                                                        {model.description}
                                                    </p>
                                                )}
                                                {model.free && (
                                                    <p
                                                        className="mt-1 text-green-600 font-medium"
                                                        data-oid="3sxn:uc"
                                                    >
                                                        ✓ Kostenloses Modell
                                                    </p>
                                                )}
                                                {model.context_length && (
                                                    <p
                                                        className="mt-1 text-gray-600"
                                                        data-oid="76sy19k"
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

                            <p className="text-sm text-gray-500 mt-1" data-oid="m6r-t1o">
                                {apiProvider === 'openrouter'
                                    ? 'Nur kostenlose Modelle werden angezeigt'
                                    : 'Wählen Sie das gewünschte AI-Modell für die Analyse'}
                            </p>
                        </div>

                        {/* Custom Prompt */}
                        <div data-oid="h44lj_u">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid=":4:5vr9"
                            >
                                Benutzerdefinierter Prompt
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Geben Sie Ihren benutzerdefinierten Prompt ein"
                                data-oid="yy:c0:b"
                            />

                            <p className="text-sm text-gray-500 mt-1" data-oid="zdxojgr">
                                Dieser Prompt wird für die Analyse der IT-Dienstleister verwendet
                            </p>
                        </div>

                        {/* Provider Information */}
                        <div
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                            data-oid="_-krvcl"
                        >
                            <h3 className="font-medium text-blue-900 mb-2" data-oid="--hanuq">
                                Anbieter-Informationen
                            </h3>
                            <div className="text-sm text-blue-700 space-y-1" data-oid="ytgd4.2">
                                {apiProvider === 'openai' && (
                                    <>
                                        <p data-oid="qj2v8.a">• OpenAI GPT-4 und GPT-3.5 Modelle</p>
                                        <p data-oid="0j469z_">• Hohe Qualität für Textanalyse</p>
                                        <p data-oid="cm.h-9o">
                                            • API-Schlüssel von platform.openai.com
                                        </p>
                                    </>
                                )}
                                {apiProvider === 'openrouter' && (
                                    <>
                                        <p data-oid="5vim4u_">
                                            • Zugang zu kostenlosen AI-Modellen
                                        </p>
                                        <p data-oid=":a6uguo">• Llama, Mistral, Qwen und andere</p>
                                        <p data-oid=".0i6_6e">• API-Schlüssel von openrouter.ai</p>
                                        <p data-oid="z7fm:6.">
                                            • Automatische Erkennung kostenloser Modelle
                                        </p>
                                    </>
                                )}
                                {apiProvider === 'deepseek' && (
                                    <>
                                        <p data-oid="byi9i8c">• DeepSeek AI-Modelle</p>
                                        <p data-oid="kj1es5x">• Kostengünstige Alternative</p>
                                        <p data-oid="f_o:76o">
                                            • API-Schlüssel von platform.deepseek.com
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center" data-oid="3ivg4le">
                            <div className="flex space-x-3" data-oid="yuespmv">
                                <button
                                    onClick={handleTestConnection}
                                    disabled={isLoadingModels || !apiKey}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="6rz-f-g"
                                >
                                    {isLoadingModels ? (
                                        <div className="flex items-center" data-oid="jr.26us">
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                                data-oid="hxjs:u:"
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
                                    data-oid=".qba-cj"
                                >
                                    {isLoadingModels ? (
                                        <div className="flex items-center" data-oid=":dgxy..">
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                                data-oid="3al35b:"
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
                                data-oid="jgbh32s"
                            >
                                {isSaving ? (
                                    <div className="flex items-center" data-oid="6a7z1po">
                                        <div
                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                                            data-oid="bcg13wa"
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
