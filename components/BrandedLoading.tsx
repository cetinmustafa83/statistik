'use client';

import { Logo } from './Logo';

interface BrandedLoadingProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function BrandedLoading({ message = 'Yükleniyor...', size = 'md' }: BrandedLoadingProps) {
    const containerSizes = {
        sm: 'min-h-[200px]',
        md: 'min-h-[400px]',
        lg: 'min-h-screen',
    };

    return (
        <div
            className={`${containerSizes[size]} bg-gray-50 dark:bg-gray-900 flex items-center justify-center`}
            data-oid="g2lreh2"
        >
            <div className="text-center" data-oid="845pl.b">
                <div className="mb-6 animate-pulse" data-oid="1fgza0w">
                    <Logo size="xl" data-oid="vm7h78a" />
                </div>

                <div className="flex items-center justify-center space-x-2 mb-4" data-oid="h748mkz">
                    <div
                        className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                        data-oid="cl9cu7k"
                    ></div>
                    <span
                        className="text-lg font-medium text-gray-700 dark:text-gray-300"
                        data-oid="3pcc5pk"
                    >
                        {message}
                    </span>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400" data-oid=":hnops3">
                    CloudHelden Akademie - IT Excellence & Innovation
                </p>

                {/* Loading Animation */}
                <div className="mt-6 flex justify-center space-x-1" data-oid="uz5d6s1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                            data-oid="xpn1067"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Branded Error Component
export function BrandedError({
    title = 'Bir hata oluştu',
    message = 'Lütfen daha sonra tekrar deneyin.',
    onRetry,
}: {
    title?: string;
    message?: string;
    onRetry?: () => void;
}) {
    return (
        <div
            className="min-h-[400px] bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
            data-oid="lv8qgyy"
        >
            <div className="text-center max-w-md mx-auto p-6" data-oid="mqyn8x0">
                <div className="mb-6" data-oid="fl.1szj">
                    <Logo size="lg" data-oid="qebupwv" />
                </div>

                <div className="mb-6" data-oid="asddb5s">
                    <div
                        className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4"
                        data-oid="ni.5b6v"
                    >
                        <svg
                            className="w-8 h-8 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="nhwpjwc"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                data-oid="dp68w2l"
                            />
                        </svg>
                    </div>

                    <h3
                        className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                        data-oid="hmoelfb"
                    >
                        {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300" data-oid="cxxbggm">
                        {message}
                    </p>
                </div>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        data-oid="j6eb3d."
                    >
                        Tekrar Dene
                    </button>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4" data-oid="0yr2b__">
                    CloudHelden Akademie - IT Excellence & Innovation
                </p>
            </div>
        </div>
    );
}
