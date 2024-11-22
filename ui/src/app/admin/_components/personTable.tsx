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
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import { useState } from 'react';
import { ArrowUpRightFromSquare } from 'lucide-react';
import { CrownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchInput from '@/app/admin/_components/searchInput';
import personTableColumns from '@/components/table/table-element/person-table-columns';
import PersonTableTooltip from '@/app/admin/_components/personTableTooltip';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { groupingOwners, removeFromGroups } from '@/lib/actions';
import OwnersModal from '@/components/modal/owners-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const PersonTable = (data) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [dummyBool, setDummyBool] = useState(false);
    const router = useRouter();
    const searchUid = data.searchUid;
    const validUid = data.groupingsInfo.resultCode;
    const groupingsInfo = data.groupingsInfo.results;
    const userInfo = data.userInfo;
    const hydrateModal = async (path) => {
        setModalData((await groupingOwners(path)).members);
        setModalOpen(true);
    };

    const close = () => {
        setModalOpen(false);
    };

    const handleRemove = async () => {
        const numSelected = table.getSelectedRowModel().rows.length;
        const arr = [];
        let i;
        for (i = 0; i < numSelected; i++) {
            const original = table.getSelectedRowModel().rows[i].original;
            if (original.inOwner) arr.push(original.path + ':owners');
            if (original.inInclude) arr.push(original.path + ':include');
            if (original.inExclude) arr.push(original.path + ':exclude');
        }
        await removeFromGroups(searchUid, arr);
        setRowSelection({});
        router.refresh();
    };

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
            <OwnersModal open={modalOpen} close={close} modalData={modalData} />
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
                            checked={userInfo === undefined ? dummyBool : table.getIsAllPageRowsSelected()}
                            onChange={
                                userInfo === undefined
                                    ? () => setDummyBool(!dummyBool)
                                    : table.getToggleAllPageRowsSelectedHandler()
                            }
                        />
                        <Button
                            className="rounded-[-0.25rem] rounded-r-[0.25rem]"
                            variant="destructive"
                            onClick={userInfo === undefined ? () => void 0 : handleRemove}
                        >
                            Remove
                        </Button>
                    </div>
                </label>
            </div>
            {validUid === 'FAILURE' && searchUid !== undefined ? (
                <Alert variant="destructive" className="w-fit mb-7">
                    <AlertDescription>{searchUid} is not in any grouping.</AlertDescription>
                </Alert>
            ) : (
                ''
            )}
            {validUid === undefined && searchUid !== '' ? (
                <Alert variant="destructive" className="w-fit mb-7">
                    <AlertDescription>
                        There was an error searching for {searchUid}. <br />
                        Please ensure you have entered a valid UH member and try again.
                    </AlertDescription>
                </Alert>
            ) : (
                ''
            )}
            {searchUid === '' ? (
                <Alert variant="destructive" className="w-fit mb-7">
                    <AlertDescription>You must enter a UH member to search.</AlertDescription>
                </Alert>
            ) : (
                ''
            )}
            <Table className="relative overflow-x-auto">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    onClick={
                                        header.column.id === 'name'
                                            ? header.column.getToggleSortingHandler()
                                            : () => void 0
                                    }
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
                {userInfo === undefined ? (
                    ''
                ) : (
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} width={cell.column.columnDef.size}>
                                        <div className="flex items-center px-2 overflow-hidden whitespace-nowrap">
                                            <div className={`m-2 ${cell.column.id === 'name' ? 'w-full' : ''}`}>
                                                {cell.column.id === 'name' && (
                                                    <div className="flex flex-row">
                                                        <PersonTableTooltip
                                                            value={'Manage grouping.'}
                                                            side={'top'}
                                                            desc={
                                                                <Link
                                                                    href={`/groupings/${cell.row.original.path}`}
                                                                    rel="noopener noreferrer"
                                                                    target="_blank"
                                                                >
                                                                    <ArrowUpRightFromSquare
                                                                        size="1.25em"
                                                                        className="text-text-primary"
                                                                        data-testid={'arrow-up-right-from-square-icon'}
                                                                    />
                                                                </Link>
                                                            }
                                                        ></PersonTableTooltip>
                                                        <div className="pl-3">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </div>
                                                        <PersonTableTooltip
                                                            value="Display the grouping's owners."
                                                            side={'right'}
                                                            desc={
                                                                <div className="ml-auto mr-3">
                                                                    <CrownIcon
                                                                        size="1.25em"
                                                                        className="text-text-primary"
                                                                        data-testid={'crown-icon'}
                                                                        onClick={() =>
                                                                            hydrateModal(cell.row.original.path)
                                                                        }
                                                                    />
                                                                </div>
                                                            }
                                                        ></PersonTableTooltip>
                                                    </div>
                                                )}
                                            </div>
                                            {cell.column.id === 'inOwner' && (
                                                <div className="ml-1">
                                                    <p className={`${cell.row.original.inOwner ? 'text-red-500' : ''}`}>
                                                        {cell.row.original.inOwner ? 'Yes' : 'No'}
                                                    </p>
                                                </div>
                                            )}
                                            {cell.column.id === 'inBasisAndInclude' && (
                                                <div>
                                                    <p
                                                        className={`${
                                                            cell.row.original.inBasisAndInclude ? 'text-red-500' : ''
                                                        }`}
                                                    >
                                                        {cell.row.original.inBasisAndInclude ? 'Yes' : 'No'}
                                                    </p>
                                                </div>
                                            )}
                                            {cell.column.id === 'inInclude' && (
                                                <div className="ml-2">
                                                    <p
                                                        className={`${
                                                            cell.row.original.inInclude ? 'text-red-500' : ''
                                                        }`}
                                                    >
                                                        {cell.row.original.inInclude ? 'Yes' : 'No'}
                                                    </p>
                                                </div>
                                            )}
                                            {cell.column.id === 'inExclude' && (
                                                <div className="ml-2">
                                                    <p
                                                        className={`${
                                                            cell.row.original.inExclude ? 'text-red-500' : ''
                                                        }`}
                                                    >
                                                        {cell.row.original.inExclude ? 'Yes' : 'No'}
                                                    </p>
                                                </div>
                                            )}
                                            {cell.column.id === 'remove' && (
                                                <div className="ml-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={row.getIsSelected()}
                                                        onChange={row.getToggleSelectedHandler()}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
            {userInfo === undefined ? '' : <PaginationBar table={table} />}
        </>
    );
};

export default PersonTable;
