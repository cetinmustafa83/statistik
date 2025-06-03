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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100" data-oid="hz0c8:x">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-100" data-oid="l:rdwk:">
                <div className="flex justify-between items-center" data-oid="9:gl-6a">
                    <h3 className="text-lg font-semibold text-gray-900" data-oid="k66dmb_">
                        Şirket Listesi ({data.length} sonuç)
                    </h3>
                    <div className="text-sm text-gray-500" data-oid="b9puda_">
                        Sayfa {currentPage} / {totalPages}
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="px-6 py-4 border-b border-gray-100" data-oid="vlu:5u-">
                    <div className="flex items-center space-x-2" data-oid="iu2mzvs">
                        <div
                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                            data-oid="qwjqr91"
                        ></div>
                        <span className="text-sm text-gray-600" data-oid="1fc2x9g">
                            Yükleniyor...
                        </span>
                    </div>
                </div>
            )}

            {/* Table Content */}
            <div className="overflow-x-auto" data-oid="0t8tuva">
                <table className="w-full" data-oid="uk08eq:">
                    <thead className="bg-gray-50" data-oid="pc_sqbe">
                        <tr data-oid="u:-:jzp">
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="d-n:km2"
                            >
                                Rank
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid=":quv54_"
                            >
                                Şirket
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="r7eob7r"
                            >
                                Lokasyon
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid=".h0l2vm"
                            >
                                Gelir 2024
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="-fk1w6h"
                            >
                                Çalışan
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="jll0sq:"
                            >
                                Pazar Payı
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200" data-oid="0a3iubp">
                        {paginatedData.map((company) => (
                            <tr
                                key={company.rank}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => onItemClick?.(company)}
                                data-oid=":_o1ypb"
                            >
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="1brigyn">
                                    <div
                                        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                        data-oid="-m2b1hn"
                                    >
                                        {company.rank}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="tw2t:yn">
                                    <div
                                        className="text-sm font-medium text-gray-900"
                                        data-oid="s-0c11a"
                                    >
                                        {company.name}
                                    </div>
                                    <div className="text-sm text-gray-500" data-oid="7s6j.d7">
                                        {company.specialty}
                                    </div>
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    data-oid="2kkvnt3"
                                >
                                    {company.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="cb:i7:1">
                                    <div
                                        className="text-sm font-medium text-gray-900"
                                        data-oid="8nk-75q"
                                    >
                                        €{company.revenue2024}B
                                    </div>
                                    <div className="text-xs text-green-600" data-oid="2y1yns5">
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
                                    data-oid="e3ptv9q"
                                >
                                    {company.employees.toLocaleString()}
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    data-oid="yrh2cp:"
                                >
                                    {company.marketShare}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100" data-oid="ycsw9s-">
                <div className="flex items-center justify-between" data-oid="uqdrae3">
                    <div className="text-sm text-gray-700" data-oid="m2yh5-8">
                        <span className="font-medium" data-oid="9.z_:ri">
                            {(currentPage - 1) * itemsPerPage + 1}
                        </span>
                        {' - '}
                        <span className="font-medium" data-oid="f88w6nc">
                            {Math.min(currentPage * itemsPerPage, data.length)}
                        </span>
                        {' / '}
                        <span className="font-medium" data-oid="b4pk454">
                            {data.length}
                        </span>{' '}
                        sonuç
                    </div>

                    <nav className="flex items-center space-x-1" data-oid=".oyjb_j">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="gdhkacx"
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
                                data-oid="lr44ovx"
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="828hsp-"
                        >
                            Sonraki
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
