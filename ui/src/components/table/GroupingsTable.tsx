'use client';
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ColumnSettings from '@/components/table/table-element/ColumnSettings';
import GroupingsTableHeaders from '@/components/table/table-element/GroupingsTableHeaders';
import PaginationBar from '@/components/table/table-element/Pagination';
import GlobalFilter from '@/components/table/table-element/GlobalFilter';
import SortArrow from '@/components/table/table-element/SortArrow';
import { useState, useEffect } from 'react';
import { SquarePen } from 'lucide-react';
import GroupingPath from '@/components/table/table-element/GroupingPath';

const GroupingsTable = ({ data }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data,
        columns: GroupingsTableHeaders,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            globalFilter: globalFilter,
            sorting: sorting
        },
        initialState: {
            pagination: {
                pageSize: 20
            }
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting
    });

    const columnCount = table.getHeaderGroups()[0].headers.length;

    return (
        <div className="px-2">
            <div className="flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color text-center pt-3">Manage Groupings</h1>
                <div className="flex items-center space-x-2">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    <div className="hidden sm:block">
                        <ColumnSettings table={table} />
                    </div>
                </div>
            </div>
            <Table className="relative overflow-x-auto">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header, index) => (
                                <TableHead
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={`font-semibold text-uh-black border-solid border-t-[1px] border-b-[2px] py-3 size-[0.1rem] ${
                                        columnCount === 2 && index === 1 ? 'w-2/3' : 'w-1/3'
                                    } ${header.column.id !== 'GROUPING NAME' ? 'hidden sm:table-cell' : ''}`}
                                >
                                    <div className="flex items-center text-[0.8rem] font-bold">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() && (
                                            <SortArrow direction={header.column.getIsSorted()} />
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row, index) => (
                        <TableRow key={row.id} className={index % 2 === 0 ? 'bg-light-grey' : ''}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className={`p-0 ${cell.column.id !== 'GROUPING NAME' ? 'hidden sm:table-cell' : ''}`}
                                    width={cell.column.columnDef.size}
                                >
                                    <div className="flex items-center pl-2 pr-2 text-[15.5px] overflow-hidden whitespace-nowrap">
                                        <div className="m-2">
                                            {cell.column.id === 'GROUPING NAME' ? (
                                                <SquarePen className="text-text-primary w-[1.25em] h-[1.25em]" />
                                            ) : null}
                                        </div>
                                        {cell.column.id === 'DESCRIPTION' ? (
                                            columnCount === 3 ? (
                                                <div className="text-table-text text-[1rem] truncate sm:max-w-[calc(6ch+1em)] md:max-w-none">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            ) : (
                                                <div className="text-table-text text-[1rem]">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            )
                                        ) : cell.column.id !== 'GROUPING PATH' ? (
                                            <div className="text-table-text text-[1rem]">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        ) : (
                                            <GroupingPath
                                                data={cell.row.getValue('GROUPING PATH')}
                                                uniqueId={cell.row.id}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <PaginationBar table={table} />
        </div>
    );
};

export default GroupingsTable;