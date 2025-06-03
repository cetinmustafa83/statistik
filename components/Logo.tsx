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
        >
            <span className="text-white font-bold text-lg">CH</span>
        </div>
    );

    if (imageError) {
        return showText ? (
            <div className="flex items-center space-x-3">
                <FallbackLogo />
                <span className={`text-xl font-bold ${textColor}`}>CloudHelden Akademie</span>
            </div>
        ) : (
            <FallbackLogo />
        );
    }

    return showText ? (
        <div className="flex items-center space-x-3">
            <img
                src="https://cloudhelden-akademie.de/pluginfile.php/1/theme_remui/logo/1746170892/Logo.org%20blau.png"
                alt="CloudHelden Akademie"
                className={`${sizeClasses[size]} w-auto ${className}`}
                onError={() => setImageError(true)}
                loading="lazy"
            />

            <span className={`text-xl font-bold ${textColor}`}>CloudHelden Akademie</span>
        </div>
    ) : (
        <img
            src="https://cloudhelden-akademie.de/pluginfile.php/1/theme_remui/logo/1746170892/Logo.org%20blau.png"
            alt="CloudHelden Akademie"
            className={`${sizeClasses[size]} w-auto ${className}`}
            onError={() => setImageError(true)}
            loading="lazy"
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
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4">
                        <Logo size="md" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && <div className="flex items-center space-x-4">{actions}</div>}
                </div>
            </div>
        </div>
    );
}

// Footer with Logo
export function BrandedFooter() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <Logo size="sm" />
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            <p className="font-medium">CloudHelden Akademie</p>
                            <p>IT Excellence & Innovation</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Über uns
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Kontakt
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Datenschutz
                        </a>
                        <a
                            href="#"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Impressum
                        </a>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; 2024 CloudHelden Akademie. Alle Rechte vorbehalten.</p>
                </div>
            </div>
        </footer>
    );
}
