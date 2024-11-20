'use client';

import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    VisibilityState
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ColumnSettings from '@/components/table/table-element/column-settings';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { GroupingPath } from '@/lib/types';
import GroupingsTableColumns from '@/components/table/groupings-table/table-element/groupings-table-columns';
import dynamic from 'next/dynamic';
import GroupingsTableSkeleton from './groupings-table-skeleton';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const GroupingsTable = ({ groupingPaths }: { groupingPaths: GroupingPath[] }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>('columnVisibility', {
        description: true,
        path: false
    });

    const table = useReactTable({
        columns: GroupingsTableColumns,
        data: groupingPaths,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { globalFilter, sorting, columnVisibility },
        initialState: { pagination: { pageSize } },
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
            <PaginationBar table={table} />
        </>
    );
};

export default dynamic(() => Promise.resolve(GroupingsTable), {
    ssr: false, // Disable SSR for localStorage
    loading: () => <GroupingsTableSkeleton />
});
