import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';

export const metadata: Metadata = {
    title: 'IT Dashboard - Anmeldung und Verwaltungspanel',
    description: 'Einfaches Anmeldesystem und Dashboard-Anwendung',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="m_v4frt">
            <body className="" data-oid="8wb4zkk">
                <ClientProviders data-oid="fk.5a6v">{children}</ClientProviders>
            </body>
        </html>
    );
}
