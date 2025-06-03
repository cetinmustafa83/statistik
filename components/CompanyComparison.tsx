'use client';

import { useState } from 'react';
import { ITCompany } from '../lib/database';

interface ComparisonProps {
    companies: ITCompany[];
}

export function CompanyComparison({ companies }: ComparisonProps) {
    const [selectedCompanies, setSelectedCompanies] = useState<ITCompany[]>([]);
    const [comparisonMode, setComparisonMode] = useState<
        'revenue' | 'growth' | 'employees' | 'market'
    >('revenue');

    const addToComparison = (company: ITCompany) => {
        if (
            selectedCompanies.length < 4 &&
            !selectedCompanies.find((c) => c.rank === company.rank)
        ) {
            setSelectedCompanies([...selectedCompanies, company]);
        }
    };

    const removeFromComparison = (companyRank: number) => {
        setSelectedCompanies(selectedCompanies.filter((c) => c.rank !== companyRank));
    };

    const getComparisonData = () => {
        switch (comparisonMode) {
            case 'revenue':
                return selectedCompanies.map((c) => ({
                    name: c.name,
                    value: c.revenue2024,
                    label: '€' + c.revenue2024 + 'B',
                }));
            case 'growth':
                return selectedCompanies.map((c) => ({
                    name: c.name,
                    value:
                        c.revenue2023 > 0
                            ? ((c.revenue2024 - c.revenue2023) / c.revenue2023) * 100
                            : 0,
                    label:
                        c.revenue2023 > 0
                            ? '+' +
                              (((c.revenue2024 - c.revenue2023) / c.revenue2023) * 100).toFixed(1) +
                              '%'
                            : '0%',
                }));
            case 'employees':
                return selectedCompanies.map((c) => ({
                    name: c.name,
                    value: c.employees,
                    label: c.employees.toLocaleString(),
                }));
            case 'market':
                return selectedCompanies.map((c) => ({
                    name: c.name,
                    value: c.marketShare,
                    label: c.marketShare + '%',
                }));
            default:
                return [];
        }
    };

    const maxValue = Math.max(...getComparisonData().map((d) => d.value));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Şirket Karşılaştırması</h3>
                <div className="flex space-x-2">
                    {['revenue', 'growth', 'employees', 'market'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setComparisonMode(mode as any)}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                comparisonMode === mode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {mode === 'revenue'
                                ? 'Gelir'
                                : mode === 'growth'
                                  ? 'Büyüme'
                                  : mode === 'employees'
                                    ? 'Çalışan'
                                    : 'Pazar Payı'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Company Selection */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                    Karşılaştırılacak Şirketler ({selectedCompanies.length}/4)
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCompanies.map((company) => (
                        <div
                            key={company.rank}
                            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                        >
                            <span className="text-sm font-medium">{company.name}</span>
                            <button
                                onClick={() => removeFromComparison(company.rank)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <select
                    onChange={(e) => {
                        const company = companies.find((c) => c.rank === parseInt(e.target.value));
                        if (company) addToComparison(company);
                        e.target.value = '';
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={selectedCompanies.length >= 4}
                >
                    <option value="">Şirket seçin...</option>
                    {companies
                        .filter((c) => !selectedCompanies.find((sc) => sc.rank === c.rank))
                        .map((company) => (
                            <option key={company.rank} value={company.rank}>
                                {company.name}
                            </option>
                        ))}
                </select>
            </div>

            {/* Comparison Chart */}
            {selectedCompanies.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                        {comparisonMode === 'revenue'
                            ? 'Gelir Karşılaştırması (2024)'
                            : comparisonMode === 'growth'
                              ? 'Büyüme Oranı Karşılaştırması'
                              : comparisonMode === 'employees'
                                ? 'Çalışan Sayısı Karşılaştırması'
                                : 'Pazar Payı Karşılaştırması'}
                    </h4>

                    {getComparisonData().map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="w-32 text-sm font-medium text-gray-700 truncate">
                                {item.name}
                            </div>
                            <div className="flex-1 flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                                        style={{ width: `${(item.value / maxValue) * 100}%` }}
                                    >
                                        <span className="text-xs text-white font-medium">
                                            {item.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedCompanies.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>Karşılaştırma yapmak için şirket seçin</p>
                </div>
            )}
        </div>
    );
}
