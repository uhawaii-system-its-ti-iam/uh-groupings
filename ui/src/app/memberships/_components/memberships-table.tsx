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
import { GroupingPath, Membership } from '@/lib/types';
import MembershipsTableColumns from '@/app/memberships/_components/memberships-table-columns';
import dynamic from 'next/dynamic';
import GroupingsTableSkeleton from '@/components/table/groupings-table/groupings-table-skeleton';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const MembershipsTable = ({
    memberships,
    isOptOut
}: {
    memberships: Membership[] | GroupingPath[];
    isOptOut: boolean;
}) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>('columnVisibility', {
        description: true,
        path: false
    });
    const [data, setData] = useState(memberships);
    const removeRow = (path: string) => {
        setData((prevData) => prevData.filter((row) => row.path !== path));
    };

    const table = useReactTable({
        columns: MembershipsTableColumns(isOptOut, removeRow),
        data: data,
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

    const visibleColumnsLength = table.getVisibleLeafColumns().length;

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <div className="pb-2">
                    <h1 className="text-[2rem] font-medium text-text-color pt-3">
                        {isOptOut ? 'Manage Memberships' : 'Available Memberships'}
                    </h1>
                    <p>
                        {isOptOut
                            ? 'Some memberships are optional, and some are required.'
                            : 'You may opt in to any of these groupings to become a member.'}
                    </p>
                </div>

                <div className="flex items-center space-x-2 md:w-60 lg:w-72">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder="Filter Groupings..." />
                    <div className="hidden sm:block">
                        <ColumnSettings table={table} />
                    </div>
                </div>
            </div>
            <Table className="table-fixed">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const isLastVisible = header.column.getIndex() === visibleColumnsLength - 1;

                                return (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={`
                                            ${
                                                !table.getIsAllColumnsVisible() && header.column.getIndex() === 1
                                                    ? 'w-7/12'
                                                    : ''
                                            }
                                            ${table.getIsAllColumnsVisible() && isLastVisible ? 'w-1/12' : ''}
                                            ${header.column.getIndex() > 0 ? 'hidden md:table-cell' : 'w-1/3'}
                                        `}
                                    >
                                        <div className={`flex items-center ${isLastVisible ? 'justify-end' : ''}`}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            <SortArrow direction={header.column.getIsSorted()} />
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className={`${cell.column.getIndex() > 0 ? 'hidden sm:table-cell' : ''} 
                                                `}
                                >
                                    <div className={`flex items-center px-2 py-1 overflow-hidden whitespace-nowrap`}>
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

export default dynamic(() => Promise.resolve(MembershipsTable), {
    ssr: false,
    loading: () => <GroupingsTableSkeleton />
});
