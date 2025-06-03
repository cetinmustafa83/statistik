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
            data-oid="-wq1y.6"
        >
            <span className="text-white font-bold text-lg" data-oid="o5sn5y5">
                CH
            </span>
        </div>
    );

    if (imageError) {
        return showText ? (
            <div className="flex items-center space-x-3" data-oid="ss80l0v">
                <FallbackLogo data-oid="j8a21od" />
                <span className={`text-xl font-bold ${textColor}`} data-oid="ukt0qyb">
                    CloudHelden Akademie
                </span>
            </div>
        ) : (
            <FallbackLogo data-oid="hhmdsib" />
        );
    }

    return showText ? (
        <div className="flex items-center space-x-3" data-oid="we05_ej">
            <img
                src="https://cloudhelden-akademie.de/pluginfile.php/1/theme_remui/logo/1746170892/Logo.org%20blau.png"
                alt="CloudHelden Akademie"
                className={`${sizeClasses[size]} w-auto ${className}`}
                onError={() => setImageError(true)}
                loading="lazy"
                data-oid="sf_ycbt"
            />

            <span className={`text-xl font-bold ${textColor}`} data-oid="b_boht8">
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
            data-oid=".-z46nw"
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
            data-oid="ng4e:o1"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="z.j8cl7">
                <div className="flex justify-between items-center py-4" data-oid="f6:er7q">
                    <div className="flex items-center space-x-4" data-oid="dwrxr:f">
                        <Logo size="md" data-oid="el7f9cc" />
                        <div data-oid="_a91eq4">
                            <h1
                                className="text-2xl font-bold text-gray-900 dark:text-white"
                                data-oid="yglegnu"
                            >
                                {title}
                            </h1>
                            {subtitle && (
                                <p
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                    data-oid="3981-j5"
                                >
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && (
                        <div className="flex items-center space-x-4" data-oid="2ah6tps">
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
            data-oid="-rwlu7w"
        >
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-oid="r2dcbod">
                <div
                    className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
                    data-oid=":tlvdfs"
                >
                    <div className="flex items-center space-x-4" data-oid="6byae5n">
                        <Logo size="sm" data-oid="ao:7er9" />
                        <div
                            className="text-sm text-gray-600 dark:text-gray-300"
                            data-oid="rdjjp2v"
                        >
                            <p className="font-medium" data-oid="9jy3np:">
                                CloudHelden Akademie
                            </p>
                            <p data-oid="4:svsu:">IT Excellence & Innovation</p>
                        </div>
                    </div>

                    <div
                        className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300"
                        data-oid="w9u7men"
                    >
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="y41cj63"
                        >
                            Über uns
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="6nx_1tg"
                        >
                            Kontakt
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="f-24.zj"
                        >
                            Datenschutz
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            data-oid="ldn9pf1"
                        >
                            Impressum
                        </a>
                    </div>
                </div>

                <div
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400"
                    data-oid="zs2fw0o"
                >
                    <p data-oid="w49rkqr">
                        &copy; 2024 CloudHelden Akademie. Alle Rechte vorbehalten.
                    </p>
                </div>
            </div>
        </footer>
    );
}
