import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';

export const metadata: Metadata = {
    title: 'IT Dashboard - Anmeldung und Verwaltungspanel',
    description: 'Einfaches Anmeldesystem und Dashboard-Anwendung',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="tqf3c14">
            <body className="" data-oid="vs6g_vh">
                <ClientProviders data-oid="v3:8lv5">{children}</ClientProviders>
            </body>
        </html>
    );
}
