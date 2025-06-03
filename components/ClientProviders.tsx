'use client';

import { ToastProvider } from '../lib/toast';

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return <ToastProvider data-oid="15qijxf">{children}</ToastProvider>;
}
