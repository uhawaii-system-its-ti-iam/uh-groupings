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
import GroupingsTableColumns from '@/components/table/table-element/groupings-table-columns';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import { useState } from 'react';
import { SquarePen } from 'lucide-react';
import GroupingPathCell from '@/components/table/table-element/grouping-path-cell';
import Link from 'next/link';
import { useLocalStorage } from 'usehooks-ts';
import { GroupingPath } from '@/lib/types';
import TooltipOnTruncate from '@/components/table/table-element/tooltip-on-truncate';

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
        enableMultiSort: true
    });

    const columnCount = table.getHeaderGroups()[0].headers.length;

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color pt-3">Manage Groupings</h1>
                <div className="flex items-center space-x-2 md:w-60 lg:w-72">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    <div className="hidden sm:block">
                        <ColumnSettings table={table} />
                    </div>
                </div>
            </div>
            <Table className="table-fixed">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header, index) => (
                                <TableHead
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={`
                                    ${columnCount === 2 && index === 1 ? 'w-2/3' : 'w-1/3'} 
                                    ${header.column.id !== 'name' ? 'hidden sm:table-cell' : ''}`}
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
                                    className={`${cell.column.id !== 'name' ? 'hidden sm:table-cell' : ''}`}
                                    width={cell.column.columnDef.size}
                                >
                                    <div className="flex items-center px-2 overflow-hidden whitespace-nowrap">
                                        <div className={`m-2 ${cell.column.id === 'name' ? 'w-full' : ''}`}>
                                            {cell.column.id === 'name' && (
                                                <Link href={`/groupings/${cell.row.getValue('path')}`}>
                                                    <div className="flex">
                                                        <SquarePen
                                                            size="1.25em"
                                                            className="text-text-primary"
                                                            data-testid={'square-pen-icon'}
                                                        />
                                                        <div className="pl-2">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </div>
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                        {cell.column.id === 'description' && (
                                            <TooltipOnTruncate value={String(cell.getValue() as string)}>
                                                <div
                                                    className={`${
                                                        columnCount === 3
                                                            ? 'truncate sm:max-w-[calc(6ch+1em)] md:max-w-[calc(40ch+1em)]'
                                                            : 'truncate'
                                                    }`}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            </TooltipOnTruncate>
                                        )}
                                        {cell.column.id === 'path' && (
                                            <GroupingPathCell path={cell.row.getValue('path')} />
                                        )}
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

export default GroupingsTable;
