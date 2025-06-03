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
            data-oid="0gr.0dh"
        >
            <div className="text-center" data-oid="u9uut17">
                <div className="mb-6 animate-pulse" data-oid="_41pc05">
                    <Logo size="xl" data-oid="sr0qqxv" />
                </div>

                <div className="flex items-center justify-center space-x-2 mb-4" data-oid="ro1qjiy">
                    <div
                        className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                        data-oid="jodx-wg"
                    ></div>
                    <span
                        className="text-lg font-medium text-gray-700 dark:text-gray-300"
                        data-oid="lw2.qjw"
                    >
                        {message}
                    </span>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400" data-oid="j4m9yxn">
                    CloudHelden Akademie - IT Excellence & Innovation
                </p>

                {/* Loading Animation */}
                <div className="mt-6 flex justify-center space-x-1" data-oid="d3ae9:r">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                            data-oid="0tu1_-x"
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
            data-oid="2c0cwbg"
        >
            <div className="text-center max-w-md mx-auto p-6" data-oid="-fh0fqw">
                <div className="mb-6" data-oid="52gpa8s">
                    <Logo size="lg" data-oid=":sog8ar" />
                </div>

                <div className="mb-6" data-oid="shzluh:">
                    <div
                        className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4"
                        data-oid="k:x7sb9"
                    >
                        <svg
                            className="w-8 h-8 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="b834t1x"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                data-oid="uq77day"
                            />
                        </svg>
                    </div>

                    <h3
                        className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                        data-oid="wfbktn1"
                    >
                        {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300" data-oid="q.y_ybb">
                        {message}
                    </p>
                </div>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        data-oid="psj7glz"
                    >
                        Tekrar Dene
                    </button>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4" data-oid="84b816y">
                    CloudHelden Akademie - IT Excellence & Innovation
                </p>
            </div>
        </div>
    );
}
