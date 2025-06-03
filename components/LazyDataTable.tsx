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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100" data-oid="7jzo-i7">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-100" data-oid="a-to4yg">
                <div className="flex justify-between items-center" data-oid=":rwrm30">
                    <h3 className="text-lg font-semibold text-gray-900" data-oid="v71s6yw">
                        Şirket Listesi ({data.length} sonuç)
                    </h3>
                    <div className="text-sm text-gray-500" data-oid="4rf:n3e">
                        Sayfa {currentPage} / {totalPages}
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="px-6 py-4 border-b border-gray-100" data-oid="okva3ef">
                    <div className="flex items-center space-x-2" data-oid="rvvurbc">
                        <div
                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                            data-oid="l_a8vqc"
                        ></div>
                        <span className="text-sm text-gray-600" data-oid=":sk10gy">
                            Yükleniyor...
                        </span>
                    </div>
                </div>
            )}

            {/* Table Content */}
            <div className="overflow-x-auto" data-oid="8h-k4r-">
                <table className="w-full" data-oid="m4j2-lb">
                    <thead className="bg-gray-50" data-oid="oao43zb">
                        <tr data-oid="71u3swn">
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="yqawy79"
                            >
                                Rank
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="_f6c4-6"
                            >
                                Şirket
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid=":jmqb8z"
                            >
                                Lokasyon
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="rx8jqnw"
                            >
                                Gelir 2024
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="af9sj9:"
                            >
                                Çalışan
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="jyn:8:4"
                            >
                                Pazar Payı
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200" data-oid="od9s6az">
                        {paginatedData.map((company) => (
                            <tr
                                key={company.rank}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => onItemClick?.(company)}
                                data-oid="ys:ai:."
                            >
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="kjhe4if">
                                    <div
                                        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                        data-oid=".594i:9"
                                    >
                                        {company.rank}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="w:064fv">
                                    <div
                                        className="text-sm font-medium text-gray-900"
                                        data-oid="btld7c8"
                                    >
                                        {company.name}
                                    </div>
                                    <div className="text-sm text-gray-500" data-oid="jnx968f">
                                        {company.specialty}
                                    </div>
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    data-oid="8j7qzwk"
                                >
                                    {company.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="p7t51fy">
                                    <div
                                        className="text-sm font-medium text-gray-900"
                                        data-oid="oa55_he"
                                    >
                                        €{company.revenue2024}B
                                    </div>
                                    <div className="text-xs text-green-600" data-oid="x2pa9a6">
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
                                    data-oid="o-md9:6"
                                >
                                    {company.employees.toLocaleString()}
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    data-oid="c4v-ue:"
                                >
                                    {company.marketShare}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100" data-oid="9czm16o">
                <div className="flex items-center justify-between" data-oid="ok.j8i0">
                    <div className="text-sm text-gray-700" data-oid="9rfwyrb">
                        <span className="font-medium" data-oid="qgv67.k">
                            {(currentPage - 1) * itemsPerPage + 1}
                        </span>
                        {' - '}
                        <span className="font-medium" data-oid="l2vc.ef">
                            {Math.min(currentPage * itemsPerPage, data.length)}
                        </span>
                        {' / '}
                        <span className="font-medium" data-oid="wy92ucw">
                            {data.length}
                        </span>{' '}
                        sonuç
                    </div>

                    <nav className="flex items-center space-x-1" data-oid="sjze:4g">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="c2pv_7g"
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
                                data-oid="j19mxji"
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="0yzqw-f"
                        >
                            Sonraki
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
