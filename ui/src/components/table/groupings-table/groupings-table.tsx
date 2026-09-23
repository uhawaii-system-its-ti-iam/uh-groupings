'use client';

import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    VisibilityState
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ColumnSettings from '@/components/table/table-element/column-settings';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';
import { GroupingPath } from '@/lib/types';
import GroupingsTableColumns, {
    AdminGroupingsTableColumns
} from '@/components/table/groupings-table/table-element/groupings-table-columns';
import dynamic from 'next/dynamic';
import GroupingsTableSkeleton from './groupings-table-skeleton';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);
const smBreakpoint = 576;

type ServerPage = { page: number; pageSize: number; totalCount: number };
const GroupingsTable = ({
                            groupingPaths,
                            fromAdmin = false,
                            serverPage
                        }: {
    groupingPaths: GroupingPath[];
    fromAdmin?: boolean;
    serverPage?: ServerPage;
}) => {
    const [serverData, setServerData] = useState({ groupingPaths, serverPage, search: '' });
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const latestRequest = useRef(0);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>('columnVisibility', {
        description: true,
        path: false
    });
    const { width = 0 } = useWindowSize();
    const isSmOrLarger = width >= smBreakpoint;

    useEffect(() => setServerData({ groupingPaths, serverPage, search: '' }), [groupingPaths, serverPage]);
    const paths = serverPage ? serverData.groupingPaths : groupingPaths;
    const filteredGroupingPaths = useMemo(() => {
        if (serverPage) return paths;

        const normalizedFilter = globalFilter.trim().toLowerCase();

        if (!normalizedFilter) return paths;

        return paths.filter(
            (grouping) =>
                grouping.name.toLowerCase().includes(normalizedFilter) ||
                (isSmOrLarger &&
                    columnVisibility.description !== false &&
                    grouping.description.toLowerCase().includes(normalizedFilter)) ||
                (isSmOrLarger &&
                    columnVisibility.path !== false &&
                    grouping.path.toLowerCase().includes(normalizedFilter))
        );
    }, [paths, globalFilter, columnVisibility.description, columnVisibility.path, isSmOrLarger]);

    const loadPage = useCallback(async (page: number, filter = globalFilter) => {
        if (!serverData.serverPage) return;

        const search = filter.trim();
        if (page === serverData.serverPage.page && search === serverData.search) return;

        const requestId = ++latestRequest.current;
        setIsLoadingPage(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                size: String(serverData.serverPage.pageSize)
            });
            if (search) params.set('search', search);

            const response = await fetch(`/uhgroupings/api/groupings?${params.toString()}`);
            if (!response.ok) return;

            const next = await response.json();
            if (requestId !== latestRequest.current) return;
            setServerData({
                groupingPaths: next.groupingPaths,
                serverPage: { page: next.page, pageSize: next.pageSize, totalCount: next.totalCount },
                search
            });
        } finally {
            if (requestId === latestRequest.current) setIsLoadingPage(false);
        }
    }, [globalFilter, serverData]);

    useEffect(() => {
        if (!serverData.serverPage) return;

        const timeout = window.setTimeout(() => void loadPage(1, globalFilter), 250);
        return () => window.clearTimeout(timeout);
    }, [globalFilter]);

    const table = useReactTable({
        columns: fromAdmin ? AdminGroupingsTableColumns : GroupingsTableColumns,
        data: filteredGroupingPaths,
        getCoreRowModel: getCoreRowModel(),
        ...(serverPage ? {} : { getPaginationRowModel: getPaginationRowModel() }),
        getSortedRowModel: getSortedRowModel(),
        state: { globalFilter, sorting, columnVisibility },
        initialState: { pagination: { pageSize: serverPage ? serverPage.pageSize : pageSize } },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        enableMultiSort: true,
        enableSortingRemoval: false
    });

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color pt-3 text-center md:text-left">
                    Manage Groupings
                </h1>
                <div className="flex items-center space-x-2 md:w-60 lg:w-72">
                    <GlobalFilter
                        placeholder={'Filter Groupings...'}
                        filter={globalFilter}
                        setFilter={setGlobalFilter}
                    />
                    <div className="hidden sm:block">
                        <ColumnSettings table={table} />
                    </div>
                </div>
            </div>
            <Table className="table-fixed">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={`
                                      ${!table.getIsAllColumnsVisible() && header.column.getIndex() > 0 ? 'w-2/3' : ''}
                                      ${header.column.getIndex() > 0 ? 'hidden sm:table-cell' : 'w-2/5 md:w-1/3'}
                                    `}
                                >
                                    <div className="flex items-center">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        <SortArrow direction={header.column.getIsSorted()} />
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className={`${cell.column.getIndex() > 0 ? 'hidden sm:table-cell' : ''}`}
                                >
                                    <div className="flex items-center px-2 overflow-hidden whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {serverPage ? (
                <ServerPagination
                    serverPage={serverData.serverPage!}
                    isLoading={isLoadingPage}
                    onPageChange={loadPage}
                />
            ) : (
                <PaginationBar table={table} />
            )}
        </>
    );
};

export default dynamic(() => Promise.resolve(GroupingsTable), {
    ssr: false, // Disable SSR for localStorage
    loading: () => <GroupingsTableSkeleton />
});

const ServerPagination = ({
                              serverPage,
                              isLoading,
                              onPageChange
                          }: {
    serverPage: ServerPage;
    isLoading: boolean;
    onPageChange: (page: number) => void;
}) => {
    const totalPages = Math.max(1, Math.ceil(serverPage.totalCount / serverPage.pageSize));
    const pageRange = 2;
    const start = Math.max(1, serverPage.page - pageRange);
    const end = Math.min(totalPages, serverPage.page + pageRange);
    const disabledClass = 'cursor-not-allowed opacity-50';
    const linkClass = 'cursor-pointer hover:bg-light-grey';
    const button = (page: number, label: string, className: string) => (
        <button
            type="button"
            className={`${className} ${linkClass}`}
            disabled={isLoading}
            onClick={() => onPageChange(page)}
        >
            {label}
        </button>
    );

    return (
        <nav className="flex justify-center pb-3 pt-4 text-green-blue md:justify-end" aria-label="Grouping pages">
            <div className="flex rounded border">
                {serverPage.page > 1 ? (
                    button(1, 'First', 'px-2 py-2')
                ) : (
                    <span className={`px-2 py-2 ${disabledClass}`}>First</span>
                )}
                {serverPage.page > 1 ? (
                    button(serverPage.page - 1, 'Previous', 'border-l px-2 py-2')
                ) : (
                    <span className={`border-l px-2 py-2 ${disabledClass}`}>Previous</span>
                )}
                {Array.from({ length: end - start + 1 }, (_, index) => start + index).map((page) =>
                    page === serverPage.page ? (
                        <span key={page} className="border-x bg-light-green px-3 py-2 text-black">
                            {page}
                        </span>
                    ) : (
                        <span key={page}>{button(page, String(page), 'border-x px-3 py-2')}</span>
                    )
                )}
                {serverPage.page < totalPages ? (
                    button(serverPage.page + 1, 'Next', 'px-2 py-2')
                ) : (
                    <span className={`px-2 py-2 ${disabledClass}`}>Next</span>
                )}
                {serverPage.page < totalPages ? (
                    button(totalPages, 'Last', 'border-l px-2 py-2')
                ) : (
                    <span className={`border-l px-2 py-2 ${disabledClass}`}>Last</span>
                )}
            </div>
        </nav>
    );
};
