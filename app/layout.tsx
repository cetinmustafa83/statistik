import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';

export const metadata: Metadata = {
    title: 'IT Dashboard - Anmeldung und Verwaltungspanel',
    description: 'Einfaches Anmeldesystem und Dashboard-Anwendung',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="e_9hg6f">
            <body className="" data-oid="nc19qzl">
                <ClientProviders data-oid="95nyywq">{children}</ClientProviders>
            </body>
        </html>
    );
}
