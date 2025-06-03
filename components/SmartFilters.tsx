'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/database';

interface SmartFilter {
    id: string;
    name: string;
    description: string;
    criteria: any;
    popularity: number;
}

export function SmartFilters({ onFilterApply }: { onFilterApply: (filters: any) => void }) {
    const [smartFilters, setSmartFilters] = useState<SmartFilter[]>([
        {
            id: 'top-performers',
            name: 'Top Performer',
            description: 'Yüksek büyüme oranı ve güçlü pazar payı',
            criteria: { minGrowth: 10, minMarketShare: 5 },
            popularity: 85,
        },
        {
            id: 'emerging-companies',
            name: 'Yükselen Şirketler',
            description: 'Hızlı büyüyen orta ölçekli şirketler',
            criteria: { minGrowth: 15, maxRevenue: 10, minEmployees: 500 },
            popularity: 72,
        },
        {
            id: 'enterprise-leaders',
            name: 'Kurumsal Liderler',
            description: 'Büyük ölçekli, köklü IT şirketleri',
            criteria: { minRevenue: 20, minEmployees: 5000 },
            popularity: 68,
        },
    ]);

    const [savedSearches, setSavedSearches] = useState<any[]>([]);

    useEffect(() => {
        loadSavedSearches();
    }, []);

    const loadSavedSearches = () => {
        try {
            const saved = localStorage.getItem('savedSearches');
            if (saved) {
                setSavedSearches(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading saved searches:', error);
        }
    };

    const saveCurrentSearch = (searchCriteria: any, name: string) => {
        const newSearch = {
            id: Date.now().toString(),
            name,
            criteria: searchCriteria,
            createdAt: new Date(),
            lastUsed: new Date(),
        };

        const updated = [...savedSearches, newSearch];
        setSavedSearches(updated);
        localStorage.setItem('savedSearches', JSON.stringify(updated));
    };

    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            data-oid="ydkyj8k"
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="k-u_nuh">
                Akıllı Filtreler
            </h3>

            {/* Smart Filter Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-oid="uafolan">
                {smartFilters.map((filter) => (
                    <div
                        key={filter.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                        onClick={() => onFilterApply(filter.criteria)}
                        data-oid="96k3j-5"
                    >
                        <div className="flex items-center justify-between mb-2" data-oid="wwmpo5f">
                            <h4 className="font-medium text-gray-900" data-oid="srwwret">
                                {filter.name}
                            </h4>
                            <span
                                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                                data-oid="g.9szxg"
                            >
                                {filter.popularity}% popüler
                            </span>
                        </div>
                        <p className="text-sm text-gray-600" data-oid="15qsa1r">
                            {filter.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
                <div data-oid="yx87hhd">
                    <h4 className="font-medium text-gray-900 mb-3" data-oid="e93u4lw">
                        Kayıtlı Aramalar
                    </h4>
                    <div className="space-y-2" data-oid="b-zqj-4">
                        {savedSearches.slice(0, 5).map((search) => (
                            <div
                                key={search.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                onClick={() => onFilterApply(search.criteria)}
                                data-oid="_rhrhvg"
                            >
                                <div data-oid="tc2ht9y">
                                    <span className="font-medium text-gray-900" data-oid="sg5ex7s">
                                        {search.name}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2" data-oid="s_k6v2t">
                                        {new Date(search.lastUsed).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                                <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="f47mm32"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                        data-oid="0b_ks4y"
                                    />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
