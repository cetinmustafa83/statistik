'use client';

import { useState } from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showText?: boolean;
    textColor?: string;
}

export function Logo({
    size = 'md',
    className = '',
    showText = false,
    textColor = 'text-gray-900',
}: LogoProps) {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
        xl: 'h-16',
    };

    const fallbackSizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    // Fallback component when image fails to load
    const FallbackLogo = () => (
        <div
            className={`${fallbackSizes[size]} bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg ${className}`}
            data-oid="2k3vgxr"
        >
            <span className="text-white font-bold text-lg" data-oid="ufxbzx:">
                CH
            </span>
        </div>
    );

    if (imageError) {
        return showText ? (
            <div className="flex items-center space-x-3" data-oid="i1:i1rc">
                <FallbackLogo data-oid="z5d-hh4" />
                <span className={`text-xl font-bold ${textColor}`} data-oid="05co3ce">
                    CloudHelden Akademie
                </span>
            </div>
        ) : (
            <FallbackLogo data-oid="h:6wsp3" />
        );
    }

    return showText ? (
        <div className="flex items-center space-x-3" data-oid="2oyzgkf">
            <img
                src="https://cloudhelden-akademie.de/pluginfile.php/1/theme_remui/logo/1746170892/Logo.org%20blau.png"
                alt="CloudHelden Akademie"
                className={`${sizeClasses[size]} w-auto ${className}`}
                onError={() => setImageError(true)}
                loading="lazy"
                data-oid="s0r0ra7"
            />

            <span className={`text-xl font-bold ${textColor}`} data-oid="3jl_w_u">
                CloudHelden Akademie
            </span>
        </div>
    ) : (
        <img
            src="https://cloudhelden-akademie.de/pluginfile.php/1/theme_remui/logo/1746170892/Logo.org%20blau.png"
            alt="CloudHelden Akademie"
            className={`${sizeClasses[size]} w-auto ${className}`}
            onError={() => setImageError(true)}
            loading="lazy"
            data-oid="t574u80"
        />
    );
}

// Branded Header Component
export function BrandedHeader({
    title,
    subtitle,
    actions,
}: {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}) {
    return (
        <div
            className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
            data-oid="sgle6uy"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="lnpjiok">
                <div className="flex justify-between items-center py-4" data-oid="9kf4zyt">
                    <div className="flex items-center space-x-4" data-oid="db:j0qp">
                        <Logo size="md" data-oid="0oey_45" />
                        <div data-oid=".i64v:d">
                            <h1
                                className="text-2xl font-bold text-gray-900 dark:text-white"
                                data-oid="4.dpoqc"
                            >
                                {title}
                            </h1>
                            {subtitle && (
                                <p
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="z1b9l:c"
                                >
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && (
                        <div className="flex items-center space-x-4" data-oid="7t8ww-w">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Footer with Logo
export function BrandedFooter() {
    return (
        <footer
            className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
            data-oid="mh3s6lr"
        >
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="gab9_39">
                <div
                    className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
                    data-oid="kzuy5t6"
                >
                    <div className="flex items-center space-x-4" data-oid="m_x5onl">
                        <Logo size="sm" data-oid="cdko13o" />
                        <div
                            className="text-sm text-gray-600 dark:text-gray-300"
                            data-oid="t0v-:kv"
                        >
                            <p className="font-medium" data-oid="e5pn8rf">
                                CloudHelden Akademie
                            </p>
                            <p data-oid=":7j_:x:">IT Excellence & Innovation</p>
                        </div>
                    </div>

                    <div
                        className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300"
                        data-oid="ova57zc"
                    >
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="bajxts1"
                        >
                            Über uns
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="cwsl4z6"
                        >
                            Kontakt
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="2jor-99"
                        >
                            Datenschutz
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="s44g6y6"
                        >
                            Impressum
                        </a>
                    </div>
                </div>

                <div
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400"
                    data-oid="2wq.nzj"
                >
                    <p data-oid="g79v01e">
                        &copy; 2024 CloudHelden Akademie. Alle Rechte vorbehalten.
                    </p>
                </div>
            </div>
        </footer>
    );
}
