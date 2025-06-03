'use client';

import { useState, useEffect, useMemo } from 'react';
import { ITCompany } from '../lib/database';

interface LazyDataTableProps {
    data: ITCompany[];
    itemsPerPage?: number;
    onItemClick?: (item: ITCompany) => void;
}

export function LazyDataTable({ data, itemsPerPage = 10, onItemClick }: LazyDataTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([1]));
    const [isLoading, setIsLoading] = useState(false);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, itemsPerPage]);

    const loadPage = async (page: number) => {
        if (loadedPages.has(page)) return;

        setIsLoading(true);
        // Simulate API delay for demonstration
        await new Promise((resolve) => setTimeout(resolve, 300));

        setLoadedPages((prev) => new Set([...prev, page]));
        setIsLoading(false);
    };

    const handlePageChange = async (page: number) => {
        setCurrentPage(page);
        await loadPage(page);
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100" data-oid="imqwrwi">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-100" data-oid="wt7y2o2">
                <div className="flex justify-between items-center" data-oid="m-442gd">
                    <h3 className="text-lg font-semibold text-gray-900" data-oid="xcsdpam">
                        Şirket Listesi ({data.length} sonuç)
                    </h3>
                    <div className="text-sm text-gray-500" data-oid="2r7rso1">
                        Sayfa {currentPage} / {totalPages}
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="px-6 py-4 border-b border-gray-100" data-oid="-z3_0i5">
                    <div className="flex items-center space-x-2" data-oid="v4usagu">
                        <div
                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                            data-oid="t53ba2g"
                        ></div>
                        <span className="text-sm text-gray-600" data-oid=":.eh2.q">
                            Yükleniyor...
                        </span>
                    </div>
                </div>
            )}

            {/* Table Content */}
            <div className="overflow-x-auto" data-oid="v49j3ic">
                <table className="w-full" data-oid="8exa3c7">
                    <thead className="bg-gray-50" data-oid="5faq-rz">
                        <tr data-oid="v.gdnb1">
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="0xbeva9"
                            >
                                Rank
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="zae8:d7"
                            >
                                Şirket
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid=".2v44i_"
                            >
                                Lokasyon
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="50vyeqo"
                            >
                                Gelir 2024
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="qua6k3n"
                            >
                                Çalışan
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="ii3jrxe"
                            >
                                Pazar Payı
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200" data-oid="h4m35q1">
                        {paginatedData.map((company) => (
                            <tr
                                key={company.rank}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => onItemClick?.(company)}
                                data-oid="b7-4d6k"
                            >
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="83gyddh">
                                    <div
                                        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                        data-oid="3:_1edf"
                                    >
                                        {company.rank}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="wui6bnl">
                                    <div
                                        className="text-sm font-medium text-gray-900"
                                        data-oid="vdzha32"
                                    >
                                        {company.name}
                                    </div>
                                    <div className="text-sm text-gray-500" data-oid="2n5ogv2">
                                        {company.specialty}
                                    </div>
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    data-oid="_:1rnad"
                                >
                                    {company.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="d1z:kbh">
                                    <div
                                        className="text-sm font-medium text-gray-900"
                                        data-oid=":yzsdf0"
                                    >
                                        €{company.revenue2024}B
                                    </div>
                                    <div className="text-xs text-green-600" data-oid="n-6.asa">
                                        +
                                        {company.revenue2023 > 0
                                            ? (
                                                  ((company.revenue2024 - company.revenue2023) /
                                                      company.revenue2023) *
                                                  100
                                              ).toFixed(1)
                                            : '0'}
                                        % büyüme
                                    </div>
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    data-oid="2_p1it0"
                                >
                                    {company.employees.toLocaleString()}
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    data-oid="5mw5evm"
                                >
                                    {company.marketShare}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100" data-oid=":-m-xjc">
                <div className="flex items-center justify-between" data-oid="2y2wxws">
                    <div className="text-sm text-gray-700" data-oid="6mv.w5z">
                        <span className="font-medium" data-oid="v5res-y">
                            {(currentPage - 1) * itemsPerPage + 1}
                        </span>
                        {' - '}
                        <span className="font-medium" data-oid="34oxyun">
                            {Math.min(currentPage * itemsPerPage, data.length)}
                        </span>
                        {' / '}
                        <span className="font-medium" data-oid="vw:uz31">
                            {data.length}
                        </span>{' '}
                        sonuç
                    </div>

                    <nav className="flex items-center space-x-1" data-oid="jmcw.e1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid=":7.sq6i"
                        >
                            Önceki
                        </button>

                        {getVisiblePages().map((page, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    typeof page === 'number' ? handlePageChange(page) : null
                                }
                                disabled={typeof page !== 'number'}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                    page === currentPage
                                        ? 'bg-blue-600 text-white'
                                        : typeof page === 'number'
                                          ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                          : 'text-gray-400 cursor-default'
                                }`}
                                data-oid="phq5h09"
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="7qots0c"
                        >
                            Sonraki
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
