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
import AdminTableHeaders from '@/components/table/adminTable/table-element/AdminTableHeaders';
import PaginationBar from '@/components/table/table-element/Pagination';
import GlobalFilter from '@/components/table/table-element/GlobalFilter';
import SortArrow from '@/components/table/table-element/SortArrow';
import RemoveAdminsButton from '@/components/table/adminTable/table-element/RemoveAdminsButton';
import {useState} from 'react';

const AdminTable = ({data}) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data,
        columns: AdminTableHeaders,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {globalFilter, sorting},
        initialState: {pagination: {pageSize: 20}},
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting
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
                    {table.getHeaderGroups().map(headerGroup => (
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
                                    <div className="flex items-center pl-2 pr-2
                                    text-[15.5px] overflow-hidden whitespace-nowrap">
                                        <div className="m-2">
                                            <div className="text-table-text text-[1rem] pl-2">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        </div>
                                        {cell.column.id === 'REMOVE' && (
                                            <RemoveAdminsButton/>
                                        )}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          <PaginationBar table={table}/>
        </div>
    );
};

export default AdminTable;
