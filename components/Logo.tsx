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
            data-oid="ksqib:w"
        >
            <span className="text-white font-bold text-lg" data-oid="2fmoz8-">
                CH
            </span>
        </div>
    );

    if (imageError) {
        return showText ? (
            <div className="flex items-center space-x-3" data-oid="_vejlvv">
                <FallbackLogo data-oid="63b:unt" />
                <span className={`text-xl font-bold ${textColor}`} data-oid=".9rf-dc">
                    CloudHelden Akademie
                </span>
            </div>
        ) : (
            <FallbackLogo data-oid="4vqg_6b" />
        );
    }

    return showText ? (
        <div className="flex items-center space-x-3" data-oid="sa94gch">
            <img
                src="https://cloudhelden-akademie.de/pluginfile.php/1/theme_remui/logo/1746170892/Logo.org%20blau.png"
                alt="CloudHelden Akademie"
                className={`${sizeClasses[size]} w-auto ${className}`}
                onError={() => setImageError(true)}
                loading="lazy"
                data-oid="qs-6wnb"
            />

            <span className={`text-xl font-bold ${textColor}`} data-oid="h2kgeez">
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
            data-oid="h:abn8x"
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
            data-oid="k0p6cvm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="zy0f8sg">
                <div className="flex justify-between items-center py-4" data-oid=".ise28w">
                    <div className="flex items-center space-x-4" data-oid="_v0df-k">
                        <Logo size="md" data-oid="49rlf-o" />
                        <div data-oid="7h7c.6k">
                            <h1
                                className="text-2xl font-bold text-gray-900 dark:text-white"
                                data-oid="9qgkrr-"
                            >
                                {title}
                            </h1>
                            {subtitle && (
                                <p
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="d_39_wn"
                                >
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && (
                        <div className="flex items-center space-x-4" data-oid="cjvzet6">
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
            data-oid="uyp.ol_"
        >
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="amd5y0i">
                <div
                    className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
                    data-oid="4n9di-9"
                >
                    <div className="flex items-center space-x-4" data-oid="hdahelp">
                        <Logo size="sm" data-oid="hxz_exe" />
                        <div
                            className="text-sm text-gray-600 dark:text-gray-300"
                            data-oid="92yf2se"
                        >
                            <p className="font-medium" data-oid=":_n:z_v">
                                CloudHelden Akademie
                            </p>
                            <p data-oid="db30_20">IT Excellence & Innovation</p>
                        </div>
                    </div>

                    <div
                        className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300"
                        data-oid="sa38-xd"
                    >
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="_y7l45-"
                        >
                            Über uns
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="wuvdx_t"
                        >
                            Kontakt
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="d8f8ib_"
                        >
                            Datenschutz
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="0oob5jr"
                        >
                            Impressum
                        </a>
                    </div>
                </div>

                <div
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400"
                    data-oid="j_.v61k"
                >
                    <p data-oid="bie9wq7">
                        &copy; 2024 CloudHelden Akademie. Alle Rechte vorbehalten.
                    </p>
                </div>
            </div>
        </footer>
    );
}
