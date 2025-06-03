'use client';

import { ToastProvider } from '../lib/toast';

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return <ToastProvider data-oid="0g.8_07">{children}</ToastProvider>;
}
