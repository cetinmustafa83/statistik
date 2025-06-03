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
            data-oid="cb6uzyk"
        >
            <span className="text-white font-bold text-lg" data-oid="4e5fgi4">
                CH
            </span>
        </div>
    );

    if (imageError) {
        return showText ? (
            <div className="flex items-center space-x-3" data-oid="pkes608">
                <FallbackLogo data-oid="47mm:az" />
                <span className={`text-xl font-bold ${textColor}`} data-oid="46to5kz">
                    CloudHelden Akademie
                </span>
            </div>
        ) : (
            <FallbackLogo data-oid="q5-ges3" />
        );
    }

    return showText ? (
        <div className="flex items-center space-x-3" data-oid=":osra4.">
            <img
                src="https://cloudhelden-akademie.de/pluginfile.php/1/theme_remui/logo/1746170892/Logo.org%20blau.png"
                alt="CloudHelden Akademie"
                className={`${sizeClasses[size]} w-auto ${className}`}
                onError={() => setImageError(true)}
                loading="lazy"
                data-oid="ub3zc7u"
            />

            <span className={`text-xl font-bold ${textColor}`} data-oid="t2pwq41">
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
            data-oid="kebg0af"
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
            data-oid="yrj2t4f"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="1eo6o7w">
                <div className="flex justify-between items-center py-4" data-oid="jt3c37b">
                    <div className="flex items-center space-x-4" data-oid=":m9f96c">
                        <Logo size="md" data-oid="cq6_3:f" />
                        <div data-oid="sy14h2s">
                            <h1
                                className="text-2xl font-bold text-gray-900 dark:text-white"
                                data-oid="62b-t.9"
                            >
                                {title}
                            </h1>
                            {subtitle && (
                                <p
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="r_:zj_5"
                                >
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && (
                        <div className="flex items-center space-x-4" data-oid="dvoidq.">
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
            data-oid="r9foouo"
        >
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="um1kgcz">
                <div
                    className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
                    data-oid="ynm1e9s"
                >
                    <div className="flex items-center space-x-4" data-oid="4soy.ac">
                        <Logo size="sm" data-oid="0yqjapf" />
                        <div
                            className="text-sm text-gray-600 dark:text-gray-300"
                            data-oid="wjdb.f."
                        >
                            <p className="font-medium" data-oid="m.8f_2a">
                                CloudHelden Akademie
                            </p>
                            <p data-oid="i91u85.">IT Excellence & Innovation</p>
                        </div>
                    </div>

                    <div
                        className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300"
                        data-oid="phs3k_1"
                    >
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="xgpt:ye"
                        >
                            Über uns
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="m:n5jfc"
                        >
                            Kontakt
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="pekr.fb"
                        >
                            Datenschutz
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="jex:_w6"
                        >
                            Impressum
                        </a>
                    </div>
                </div>

                <div
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400"
                    data-oid="62yrn9u"
                >
                    <p data-oid="5hplgzd">
                        &copy; 2024 CloudHelden Akademie. Alle Rechte vorbehalten.
                    </p>
                </div>
            </div>
        </footer>
    );
}
