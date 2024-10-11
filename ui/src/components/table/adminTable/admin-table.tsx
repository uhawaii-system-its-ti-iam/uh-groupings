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

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color pt-3">Manage Admins</h1>
                <div className="flex items-center space-x-2 md:w-60 lg:w-72">
                    <GlobalFilter placeholder={'Filter Admins...'} filter={globalFilter} setFilter={setGlobalFilter}/>
                </div>
            </div>
            <Table className = "relative overflow-x-auto">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={`w-1/3`}
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
                            {row.getVisibleCells().map(cell => (
                                <TableCell
                                  key={cell.id}
                                  width={cell.column.columnDef.size}
                                >
                                    <div className="flex items-center px-2 overflow-hidden whitespace-nowrap">
                                        <div className="m-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
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
        </>
    );
};

export default AdminTable;
