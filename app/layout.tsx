import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';

export const metadata: Metadata = {
    title: 'IT Dashboard - Anmeldung und Verwaltungspanel',
    description: 'Einfaches Anmeldesystem und Dashboard-Anwendung',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="8hjuhoz">
            <body className="" data-oid=":uoub8y">
                <ClientProviders data-oid="cy9x_f3">{children}</ClientProviders>
            </body>
        </html>
    );
}
