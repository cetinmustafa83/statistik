import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';

export const metadata: Metadata = {
    title: 'IT Dashboard - Anmeldung und Verwaltungspanel',
    description: 'Einfaches Anmeldesystem und Dashboard-Anwendung',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="sgv:e-8">
            <body className="" data-oid="wo5-xbc">
                <ClientProviders data-oid="va2so:h">{children}</ClientProviders>
            </body>
        </html>
    );
}
