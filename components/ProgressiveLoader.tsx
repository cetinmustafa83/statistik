'use client';

import { useState, useEffect, useRef } from 'react';

interface ProgressiveLoaderProps {
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
    batchSize?: number;
    loadingDelay?: number;
    className?: string;
}

export function ProgressiveLoader({
    items,
    renderItem,
    batchSize = 5,
    loadingDelay = 100,
    className = '',
}: ProgressiveLoaderProps) {
    const [loadedCount, setLoadedCount] = useState(batchSize);
    const [isLoading, setIsLoading] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && loadedCount < items.length && !isLoading) {
                    loadMoreItems();
                }
            },
            { threshold: 0.1 },
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [loadedCount, items.length, isLoading]);

    const loadMoreItems = async () => {
        setIsLoading(true);

        // Simulate loading delay for better UX
        await new Promise((resolve) => setTimeout(resolve, loadingDelay));

        setLoadedCount((prev) => Math.min(prev + batchSize, items.length));
        setIsLoading(false);
    };

    const visibleItems = items.slice(0, loadedCount);
    const hasMore = loadedCount < items.length;

    return (
        <div className={className} data-oid="uxfudry">
            {/* Rendered Items */}
            <div className="space-y-4" data-oid="m4wwrrq">
                {visibleItems.map((item, index) => (
                    <div
                        key={index}
                        className="animate-fadeIn"
                        style={{
                            animationDelay: `${(index % batchSize) * 50}ms`,
                            animationFillMode: 'both',
                        }}
                        data-oid=".1b5gbf"
                    >
                        {renderItem(item, index)}
                    </div>
                ))}
            </div>

            {/* Loading Indicator */}
            {hasMore && (
                <div ref={loaderRef} className="mt-8 text-center" data-oid="8uqk0cd">
                    {isLoading ? (
                        <div
                            className="flex items-center justify-center space-x-2"
                            data-oid="t91ansp"
                        >
                            <div
                                className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                                data-oid="4m-h14c"
                            ></div>
                            <span className="text-gray-600" data-oid="ls0t4jm">
                                Daha fazla yükleniyor...
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={loadMoreItems}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            data-oid="p6fivuf"
                        >
                            Daha Fazla Yükle ({items.length - loadedCount} kaldı)
                        </button>
                    )}
                </div>
            )}

            {/* Progress Bar */}
            {items.length > batchSize && (
                <div className="mt-4" data-oid="by85olf">
                    <div
                        className="flex justify-between text-sm text-gray-600 mb-1"
                        data-oid="dr52ucv"
                    >
                        <span data-oid="o18ztmd">
                            Yüklenen: {loadedCount} / {items.length}
                        </span>
                        <span data-oid="6dd.srk">
                            {Math.round((loadedCount / items.length) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2" data-oid="aw-xpe2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(loadedCount / items.length) * 100}%` }}
                            data-oid="06vabp4"
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}
