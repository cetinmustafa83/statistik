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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100" data-oid="2bfv0mc">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-100" data-oid="ml5h0hp">
                <div className="flex justify-between items-center" data-oid="wr_.5p6">
                    <h3 className="text-lg font-semibold text-gray-900" data-oid="8uvksj7">
                        Şirket Listesi ({data.length} sonuç)
                    </h3>
                    <div className="text-sm text-gray-500" data-oid=".4568n9">
                        Sayfa {currentPage} / {totalPages}
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="px-6 py-4 border-b border-gray-100" data-oid="mrom4vo">
                    <div className="flex items-center space-x-2" data-oid="p_xmr4r">
                        <div
                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                            data-oid="8fwtl2d"
                        ></div>
                        <span className="text-sm text-gray-600" data-oid="-vepnqe">
                            Yükleniyor...
                        </span>
                    </div>
                </div>
            )}

            {/* Table Content */}
            <div className="overflow-x-auto" data-oid="-08zr26">
                <table className="w-full" data-oid="q_:2e0i">
                    <thead className="bg-gray-50" data-oid="p7r-m4h">
                        <tr data-oid="sfpj8f.">
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="y64oepa"
                            >
                                Rank
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="_rhejwk"
                            >
                                Şirket
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="k4th14p"
                            >
                                Lokasyon
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="8kni_hn"
                            >
                                Gelir 2024
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="-8j.e7h"
                            >
                                Çalışan
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                data-oid="l13wwzr"
                            >
                                Pazar Payı
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200" data-oid="eu4kfv8">
                        {paginatedData.map((company) => (
                            <tr
                                key={company.rank}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => onItemClick?.(company)}
                                data-oid="vv00.pi"
                            >
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="c4inuji">
                                    <div
                                        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                        data-oid="31vyesg"
                                    >
                                        {company.rank}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="p-hfre7">
                                    <div
                                        className="text-sm font-medium text-gray-900"
                                        data-oid="p1oj2to"
                                    >
                                        {company.name}
                                    </div>
                                    <div className="text-sm text-gray-500" data-oid="b6gxt8u">
                                        {company.specialty}
                                    </div>
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    data-oid="p-al0j2"
                                >
                                    {company.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap" data-oid="ossiog-">
                                    <div
                                        className="text-sm font-medium text-gray-900"
                                        data-oid="00qr5:u"
                                    >
                                        €{company.revenue2024}B
                                    </div>
                                    <div className="text-xs text-green-600" data-oid=".53.pgx">
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
                                    data-oid="xatu.::"
                                >
                                    {company.employees.toLocaleString()}
                                </td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    data-oid="ap_lua8"
                                >
                                    {company.marketShare}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100" data-oid="-naa6m9">
                <div className="flex items-center justify-between" data-oid="cu5cywp">
                    <div className="text-sm text-gray-700" data-oid=":osh3w0">
                        <span className="font-medium" data-oid="1zau6-4">
                            {(currentPage - 1) * itemsPerPage + 1}
                        </span>
                        {' - '}
                        <span className="font-medium" data-oid="snpw28e">
                            {Math.min(currentPage * itemsPerPage, data.length)}
                        </span>
                        {' / '}
                        <span className="font-medium" data-oid="hzwqm-5">
                            {data.length}
                        </span>{' '}
                        sonuç
                    </div>

                    <nav className="flex items-center space-x-1" data-oid="k-:ur.o">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="5ou-t25"
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
                                data-oid="kyovshr"
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid=":h-n2z4"
                        >
                            Sonraki
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
