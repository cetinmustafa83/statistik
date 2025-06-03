import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
    title: 'IT Dashboard - Giriş ve Yönetim Paneli',
    description: 'Basit giriş sistemi ve dashboard uygulaması',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="8hjuhoz">
            <body className="" data-oid=":uoub8y">
                {children}
            </body>
        </html>
    );
}
