'use client';

import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel
} from '@tanstack/react-table';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import AdminTableColumns from '@/components/table/adminTable/table-element/admin-table-columns';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import RemoveAdminsDialog from '@/components/table/adminTable/table-element/remove-admins-dialog';
import {useState} from 'react';
//import AddAdminsDialog from '@/components/table/adminTable/table-element/add-admins-dialog';
import {MemberResult} from '@/lib/types';
const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const AdminTable = ({ members } : { members: MemberResult[] }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    //const [adminInput, setAdminInput] = useState('');
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        columns: AdminTableColumns,
        data: members,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { globalFilter, sorting },
        initialState: { pagination: { pageSize } },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        enableMultiSort: true
    });

    const columnCount = table.getHeaderGroups()[0].headers.length;

    return (
        <div className="px-2">
            <div className="flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color text-center pt-3">Manage Admins</h1>
                <div className="flex items-center space-x-2">
                    <GlobalFilter placeholder={'Filter Admins...'} filter={globalFilter} setFilter={setGlobalFilter}/>
                </div>
            </div>
            <Table className="relative overflow-x-auto">
                <TableHeader>
                    { /*{table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header, index) => (
                                <TableHead
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={`font-semibold text-uh-black
                                    border-solid border-t-[1px] border-b-[2px] py-3 size-[0.1rem] ${
                                        columnCount === 2 && index === 1 ? 'w-2/3' : 'w-1/3'
                                    } ${header.column.id !== 'GROUPING NAME' ? 'hidden sm:table-cell' : ''}`}
                                >
                                    <div className="flex items-center text-[0.8rem] font-bold">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() && (
                                            <SortArrow direction={header.column.getIsSorted()}/>
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}*/ }
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
                    {table.getRowModel().rows.map((row, index) => (
                        <TableRow key={row.id} className={index % 2 === 0 ? 'bg-light-grey' : ''}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell
                                  key={cell.id}
                                  className={`p-0`}
                                  width={cell.column.columnDef.size}
                                >
                                    <div className="flex items-center px-2 overflow-hidden whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        {cell.column.id === 'REMOVE' && (
                                            <RemoveAdminsDialog
                                                uid={row.getValue('uid')}
                                                name={row.getValue('name')}
                                                uhUuid={row.getValue('uhUuid')}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>

{/*
                Below is GroupingsTable's example
*/}

                {/*{table.getRowModel().rows.map((row) => (
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
                ))}*/}
            </Table>
            <div className="grid grid-cols-2 items-center">
                <div>
                    {/*comment this out <AddAdmin input={adminInput} setInput={setAdminInput}/>
                    <AddAdminsDialog input={adminInput} setInput={setAdminInput}/>*/}
                </div>
                <div className="flex justify-end">
                    <PaginationBar table={table}/>
                </div>
            </div>
        </div>
    );
};

export default AdminTable;
