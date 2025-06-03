'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }} data-oid="ajkh66n">
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} data-oid="azvlm3x" />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2" data-oid="bup-:sg">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} data-oid="cszmt30" />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getIconColor = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'text-green-400';
            case 'error':
                return 'text-red-400';
            case 'warning':
                return 'text-yellow-400';
            case 'info':
                return 'text-blue-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div
            className={`max-w-sm w-full border rounded-lg p-4 shadow-lg animate-slide-in ${getToastStyles(toast.type)}`}
            data-oid="xdrus7w"
        >
            <div className="flex items-start" data-oid="w5-uptc">
                <div className="flex-shrink-0" data-oid="f.6mb35">
                    {toast.type === 'success' && (
                        <svg
                            className={`h-5 w-5 ${getIconColor(toast.type)}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            data-oid="r3o9ls6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                                data-oid="0v2y_yg"
                            />
                        </svg>
                    )}
                    {toast.type === 'error' && (
                        <svg
                            className={`h-5 w-5 ${getIconColor(toast.type)}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            data-oid="m_q6v2z"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                                data-oid="dhaexd9"
                            />
                        </svg>
                    )}
                    {toast.type === 'warning' && (
                        <svg
                            className={`h-5 w-5 ${getIconColor(toast.type)}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            data-oid="5gf_oai"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                                data-oid="scc1517"
                            />
                        </svg>
                    )}
                    {toast.type === 'info' && (
                        <svg
                            className={`h-5 w-5 ${getIconColor(toast.type)}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            data-oid="hs1rm81"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                                data-oid="g7-ygzs"
                            />
                        </svg>
                    )}
                </div>
                <div className="ml-3 w-0 flex-1" data-oid="bi92e1j">
                    <p className="text-sm font-medium" data-oid="7glye1-">
                        {toast.title}
                    </p>
                    {toast.message && (
                        <p className="mt-1 text-sm opacity-90" data-oid="s_kxug0">
                            {toast.message}
                        </p>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0 flex" data-oid="8-9rwsb">
                    <button
                        className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => onRemove(toast.id)}
                        data-oid="wd5mo7v"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            data-oid="cy506w7"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                                data-oid="9do..et"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
