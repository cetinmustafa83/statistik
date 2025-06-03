import { ToastType } from './toast';

export interface ToastMessage {
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

export const toastMessages = {
    // Success messages
    dataUpdated: {
        type: 'success' as ToastType,
        title: 'Daten erfolgreich aktualisiert!',
        message: 'Die IT-Dienstleister Daten wurden erfolgreich abgerufen und aktualisiert.',
        duration: 5000,
    },
    settingsSaved: {
        type: 'success' as ToastType,
        title: 'Einstellungen gespeichert!',
        message: 'Ihre AI-Einstellungen wurden erfolgreich gespeichert.',
        duration: 4000,
    },
    loginSuccess: {
        type: 'success' as ToastType,
        title: 'Anmeldung erfolgreich!',
        message: 'Willkommen im IT Dashboard.',
        duration: 3000,
    },

    // Error messages
    loginFailed: {
        type: 'error' as ToastType,
        title: 'Anmeldung fehlgeschlagen',
        message: 'Ungültige Anmeldedaten! Bitte verwenden Sie: admin / admin',
        duration: 6000,
    },
    dataLoadError: {
        type: 'error' as ToastType,
        title: 'Fehler beim Laden der Daten',
        message: 'Die Unternehmensdaten konnten nicht geladen werden.',
        duration: 5000,
    },
    queryError: (error?: string) => ({
        type: 'error' as ToastType,
        title: 'Fehler beim Abrufen der Daten',
        message: error || 'Ein unbekannter Fehler ist aufgetreten.',
        duration: 6000,
    }),
    unexpectedError: {
        type: 'error' as ToastType,
        title: 'Unerwarteter Fehler',
        message: 'Ein unerwarteter Fehler ist beim Abrufen der Daten aufgetreten.',
        duration: 5000,
    },

    // Warning messages
    apiSettingsMissing: {
        type: 'warning' as ToastType,
        title: 'API-Einstellungen fehlen',
        message: 'Bitte konfigurieren Sie zuerst Ihre AI-Einstellungen in den Einstellungen.',
        duration: 8000,
    },
    apiKeyRequired: {
        type: 'warning' as ToastType,
        title: 'API-Schlüssel erforderlich',
        message: 'Bitte geben Sie einen gültigen API-Schlüssel ein.',
        duration: 5000,
    },
    promptRequired: {
        type: 'warning' as ToastType,
        title: 'Prompt erforderlich',
        message: 'Bitte geben Sie einen benutzerdefinierten Prompt ein.',
        duration: 5000,
    },

    // Info messages
    cronActive: {
        type: 'info' as ToastType,
        title: 'Automatische Updates aktiv',
        message: 'Das System aktualisiert die Daten automatisch alle 6 Stunden.',
        duration: 4000,
    },
};
