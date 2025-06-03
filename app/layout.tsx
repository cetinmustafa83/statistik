import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';

export const metadata: Metadata = {
    title: 'IT Dashboard - Anmeldung und Verwaltungspanel',
    description: 'Einfaches Anmeldesystem und Dashboard-Anwendung',
    icons: {
        icon: '/icon.svg',
        shortcut: '/icon.svg',
        apple: '/icon.svg',
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="-rx7vc:">
            <body className="" data-oid="ut6c:y7">
                <ClientProviders data-oid="bfd4jo4">{children}</ClientProviders>
            </body>
        </html>
    );
}
