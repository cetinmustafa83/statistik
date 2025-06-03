'use client';

import { ToastProvider } from '../lib/toast';

export function ClientProviders({ children, ...props }: { children: React.ReactNode }) {
    return <ToastProvider {...props}>{children}</ToastProvider>;
}
