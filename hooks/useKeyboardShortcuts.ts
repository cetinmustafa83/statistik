import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
    key: string;
    ctrlKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    metaKey?: boolean;
    action: () => void;
    description: string;
    preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        for (const shortcut of shortcuts) {
            const {
                key,
                ctrlKey = false,
                altKey = false,
                shiftKey = false,
                metaKey = false,
                action,
                preventDefault = true
            } = shortcut;

            if (
                event.key.toLowerCase() === key.toLowerCase() &&
                event.ctrlKey === ctrlKey &&
                event.altKey === altKey &&
                event.shiftKey === shiftKey &&
                event.metaKey === metaKey
            ) {
                if (preventDefault) {
                    event.preventDefault();
                }
                action();
                break;
            }
        }
    }, [shortcuts]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return shortcuts;
}

export function KeyboardShortcutsHelp({ shortcuts }: { shortcuts: ShortcutConfig[] }) {
    const formatShortcut = (shortcut: ShortcutConfig) => {
        const keys = [];
        if (shortcut.ctrlKey) keys.push('Ctrl');
        if (shortcut.altKey) keys.push('Alt');
        if (shortcut.shiftKey) keys.push('Shift');
        if (shortcut.metaKey) keys.push('Cmd');
        keys.push(shortcut.key.toUpperCase());
        return keys.join(' + ');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Klavye Kısayolları
            </h3>
            <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            {shortcut.description}
                        </span>
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                            {formatShortcut(shortcut)}
                        </kbd>
                    </div>
                ))}
            </div>
        </div>
    );
}