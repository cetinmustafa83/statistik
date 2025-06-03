'use client';

import { ToastProvider } from '../lib/toast';

export function ClientProviders({ children, ...props }: { children: React.ReactNode }) {
    return (
        <ToastProvider {...props} data-oid="i7ijl54">
            {children}
        </ToastProvider>
    );
}
