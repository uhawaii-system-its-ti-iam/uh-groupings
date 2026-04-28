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
import AdminTableColumns from './table-element/admin-table-columns';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GroupingGroupMember, GroupingGroupMembers } from '@/lib/types';
import dynamic from 'next/dynamic';
import AdminTableSkeleton from './admin-table-skeleton';
import AddAdmin from './table-element/add-admin';
import { useRouter } from 'next/navigation';
import { addAdmin } from '@/lib/actions';
import RemoveMemberModal from '@/components/modal/remove-member-modal';
import { Spinner } from '@/components/ui/spinner';
import DynamicModal from '@/components/modal/dynamic-modal';
import { message } from '@/lib/messages';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const AdminTable = ({ groupingGroupMembers }: { groupingGroupMembers: GroupingGroupMembers }) => {
    const router = useRouter();
    const [data, setData] = useState<GroupingGroupMember[]>(groupingGroupMembers.members);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isPending, setIsPending] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<GroupingGroupMember | null>(null);

    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successTitle, setSuccessTitle] = useState('');

    useEffect(() => {
        setData(groupingGroupMembers.members);
    }, [groupingGroupMembers.members]);

    const handleAddAdmin = useCallback(
        async (newAdmin: GroupingGroupMember) => {
            setIsPending(true);
            try {
                await addAdmin(newAdmin.uid);
                setSuccessTitle(message.AdminTable.SUCCESS.ADD_TITLE);
                setSuccessMessage(message.AdminTable.SUCCESS.ADD_BODY(newAdmin.name));
                setIsSuccessOpen(true);
                router.refresh();
            } catch (err) {
                console.error(err);
            } finally {
                setIsPending(false);
            }
        },
        [router]
    );

    const handleOpenRemoveModal = useCallback((member: GroupingGroupMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    }, []);

    const columns = useMemo(() => AdminTableColumns(handleOpenRemoveModal), [handleOpenRemoveModal]);

    const table = useReactTable<GroupingGroupMember>({
        data,
        columns,
        getRowId: (row) => row.uid,
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

    useEffect(() => {
        table.setSorting([{ id: 'name', desc: false }]);
    }, [table]);

    return (
        <>
            {isPending && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                    <Spinner />
                </div>
            )}

            <div className="flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color pt-3">Manage Admins</h1>
                <div className="flex items-center space-x-2 md:w-60 lg:w-72">
                    <GlobalFilter placeholder="Filter Admins..." filter={globalFilter} setFilter={setGlobalFilter} />
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
                                    className="w-1/3"
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
                                    className={cell.column.getIndex() > 0 ? 'hidden sm:table-cell' : ''}
                                >
                                    <div className="flex items-center px-2 py-1 whitespace-nowrap overflow-hidden">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="grid grid-cols-1 md:grid-cols-2 items-start mt-5 gap-4">
                <AddAdmin
                    uids={data.map((m) => m.uid)}
                    uhUuids={data.map((m) => m.uhUuid)}
                    onAddAdmin={handleAddAdmin}
                />
                <div className="flex justify-end">
                    <PaginationBar table={table} />
                </div>
            </div>

            {selectedMember && (
                <RemoveMemberModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedMember(null);
                    }}
                    memberToRemove={{
                        uid: selectedMember.uid,
                        name: selectedMember.name,
                        uhUuid: selectedMember.uhUuid
                    }}
                    group="admins"
                    groupingPath=""
                    onSuccess={() => {
                        setIsPending(false);
                        setSuccessTitle(message.AdminTable.SUCCESS.REMOVE_TITLE);
                        setSuccessMessage(message.AdminTable.SUCCESS.REMOVE_BODY(selectedMember.name));
                        setIsSuccessOpen(true);
                        router.refresh();
                    }}
                    onProcessing={() => {
                        setIsPending(true);
                    }}
                />
            )}

            <DynamicModal
                open={isSuccessOpen}
                title={successTitle}
                body={successMessage}
                closeText="OK"
                onClose={() => setIsSuccessOpen(false)}
            />
        </>
    );
};

export default dynamic(() => Promise.resolve(AdminTable), {
    ssr: false,
    loading: () => <AdminTableSkeleton />
});
