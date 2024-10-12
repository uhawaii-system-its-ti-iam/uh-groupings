'use client';

import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    RowSelectionState
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PersonTableColumns from '@/components/table/table-element/person-table-columns';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import { useState } from 'react';
import { ArrowUpRightFromSquare } from 'lucide-react';
import { CrownIcon } from 'lucide-react';
import { Membership } from '@/lib/types';
import { MemberResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import SearchInput from '@/app/admin/personTable/_components/searchInput';
import personTableColumns from '@/components/table/table-element/person-table-columns';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

// const managePersonTable = ({ data }: { data: Membership[] }, { results }: { results: MemberResult[] }) => {
const managePersonTable = (data) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    // console.log(data.groupingsInfo);
    // console.log(data.userInfo);
    const groupingsInfo = data.groupingsInfo;
    const userInfo = data.userInfo;

    const table = useReactTable({
        columns: personTableColumns,
        data: groupingsInfo,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { globalFilter, sorting, rowSelection },
        initialState: { pagination: { pageSize } },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection
    });

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between pt-1 mb-1">
                <div className="flex items-center">
                    <h1 className="text-[2rem] font-medium text-text-color md:justify-start pt-3">Manage Person</h1>
                    <p className="text-[1.2rem] font-medium text-text-color md:justify-end pt-5 ps-2">
                        {userInfo === undefined
                            ? ''
                            : '(' + userInfo.name + ', ' + userInfo.uid + ', ' + userInfo.uhUuid + ')'}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row md:justify-end md:w-72 lg-84 pt-3 mb-1">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
                <SearchInput />
                <label>
                    <div>
                        Check All
                        <input
                            className="mx-2"
                            type="checkbox"
                            name="checkAll"
                            checked={table.getIsAllPageRowsSelected()}
                            onChange={table.getToggleAllPageRowsSelectedHandler()}
                        />
                        <Button
                            className="rounded-[-0.25rem] rounded-r-[0.25rem]"
                            variant="destructive"
                            onClick={() => console.log(table.getState().rowSelection)}
                        >
                            Remove
                        </Button>
                    </div>
                </label>
            </div>
            <Table className="relative overflow-x-auto">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={`${header.column.id === 'name' ? 'w-1/4' : 'w-1/12'}`}
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
                                <TableCell key={cell.id} width={cell.column.columnDef.size}>
                                    <div className="flex items-center px-2 overflow-hidden whitespace-nowrap">
                                        <div className="m-2">
                                            {cell.column.id === 'name' && (
                                                <div className="flex">
                                                    <ArrowUpRightFromSquare
                                                        size="1.25em"
                                                        className="text-text-primary"
                                                        data-testid={'arrow-up-right-from-square-icon'}
                                                    />
                                                    <div className="p1-2 ps-3">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </div>
                                                    <CrownIcon
                                                        size="1.25em"
                                                        className="text-text-primary justify-items-end"
                                                        data-testid={'crown-icon'}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {cell.column.id === 'inOwner' && (
                                            <div className="text-red-500">
                                                {/*{cell.getContext() === true*/}
                                                {/*    ? flexRender(cell.column.columnDef.cell, 'Yes')*/}
                                                {/*    : flexRender(cell.column.columnDef.cell, 'No')}*/}
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        )}
                                        {cell.column.id === 'inBasisAndInclude' && (
                                            <div>
                                                {/*{cell.getContext() === true*/}
                                                {/*    ? flexRender(cell.column.columnDef.cell, 'Yes')*/}
                                                {/*    : flexRender(cell.column.columnDef.cell, 'No')}*/}
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        )}
                                        {cell.column.id === 'inInclude' && (
                                            <div>
                                                {/*{cell.getContext() === true*/}
                                                {/*    ? flexRender(cell.column.columnDef.cell, 'Yes')*/}
                                                {/*    : flexRender(cell.column.columnDef.cell, 'No')}*/}
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        )}
                                        {cell.column.id === 'inExclude' && (
                                            <div>
                                                {/*{cell.getContext() === true*/}
                                                {/*    ? flexRender(cell.column.columnDef.cell, 'Yes')*/}
                                                {/*    : flexRender(cell.column.columnDef.cell, 'No')}*/}
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        )}
                                        {cell.column.id === 'remove' && (
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    checked={row.getIsSelected()}
                                                    onChange={row.getToggleSelectedHandler()}
                                                />
                                                {/*{flexRender(cell.column.columnDef.cell, cell.getContext())}*/}
                                            </div>
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

export default managePersonTable;
