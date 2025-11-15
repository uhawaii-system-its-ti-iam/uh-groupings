'use client';

import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminTableColumns from '@/app/admin/_components/admin-table/table-element/admin-table-columns';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import { useState } from 'react';
import { GroupingGroupMembers } from '@/lib/types';
import dynamic from 'next/dynamic';
import AdminTableSkeleton from '@/app/admin/_components/admin-table/admin-table-skeleton';
import AddAdmin from '@/app/admin/_components/admin-table/table-element/add-admin';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const AdminTable = ({ groupingGroupMembers }: { groupingGroupMembers: GroupingGroupMembers }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    const uidColumn = groupingGroupMembers.members.map((member) => member.uid);
    const uhUuidColumn = groupingGroupMembers.members.map((member) => member.uhUuid);

    const table = useReactTable({
        columns: AdminTableColumns,
        data: groupingGroupMembers.members,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { globalFilter, sorting },
        initialState: { pagination: { pageSize } },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        enableMultiSort: true,
        enableSortingRemoval: false
    });

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color pt-3">Manage Admins</h1>
                <div className="flex items-center space-x-2 md:w-60 lg:w-72">
                    <GlobalFilter placeholder={'Filter Admins...'} filter={globalFilter} setFilter={setGlobalFilter} />
                </div>
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
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
            <div className="grid grid-cols-1 md:grid-cols-2 items-start mt-5 gap-4">
                <div>
                    <AddAdmin uids={uidColumn} uhUuids={uhUuidColumn} />
                </div>
                <div className="flex justify-end">
                    <PaginationBar table={table} />
                </div>
            </div>
        </>
    );
};

export default dynamic(() => Promise.resolve(AdminTable), {
    ssr: false, // Disable SSR for localStorage
    loading: () => <AdminTableSkeleton />
});
