'use client';

import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import createAdminColumns from './table-element/admin-table-columns';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GroupingGroupMember, GroupingGroupMembers } from '@/lib/types';
import dynamic from 'next/dynamic';
import AdminTableSkeleton from './admin-table-skeleton';
import AddAdmin from './table-element/add-admin';
import { useRouter } from 'next/navigation';
import { addAdmin } from '@/lib/actions';
import RemoveMemberModal from '@/components/modal/remove-member-modal';
import useBlockNavigation from '@/components/hook/useBlockNavigation';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const AdminTable = ({ groupingGroupMembers }: { groupingGroupMembers: GroupingGroupMembers }) => {
    const router = useRouter();

    // UI states for table
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data, setData] = useState<GroupingGroupMember[]>(groupingGroupMembers.members);

    // Store a backup copy for rollback (used in optimistic UI)
    const prevDataRef = useRef<GroupingGroupMember[]>([]);

    // Remove modal control
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<GroupingGroupMember | null>(null);

    // Access our global "API in progress" state
    // When true → all navigation (reload, logout, router.push) will be blocked by modal
    const { BlockModalUI, setIsApiPending } = useBlockNavigation();

    // Update table data when props change
    useEffect(() => {
        setData(groupingGroupMembers.members);
    }, [groupingGroupMembers.members]);

    // OPTIMISTIC UI: ADD ADMIN
    const handleOptimisticAdd = useCallback(
        async (newAdmin: GroupingGroupMember) => {

            // Backup data before UI change (for rollback if API fails)
            prevDataRef.current = [...data];

            // Update UI immediately (fast user feedback)
            setData(prev => [newAdmin, ...prev]);

            // Mark API as pending → lock navigation + show modal if user tries to leave
            setIsApiPending(true);

            try {
                // Actual API call
                await addAdmin(newAdmin.uid);
            } catch {
                // If API fails → rollback UI
                setData(prevDataRef.current);
            } finally {
                // API finished → unlock navigation
                setIsApiPending(false);
                router.refresh();
            }
        },
        [data, router, setIsApiPending]
    );

    // Open delete modal
    const handleOpenModal = useCallback(
        (member: GroupingGroupMember) => {
            prevDataRef.current = [...data];
            setSelectedMember(member);
            setIsModalOpen(true);
        },
        [data]
    );

    // OPTIMISTIC UI: REMOVE ADMIN
    const handleOptimisticRemove = useCallback(() => {
        if (!selectedMember) return;

        // Save backup for rollback
        prevDataRef.current = [...data];

        // Remove immediately from UI
        setData(prev => prev.filter(m => m.uid !== selectedMember.uid));

        // Lock navigation until API finishes
        setIsApiPending(true);
    }, [data, selectedMember, setIsApiPending]);
    // Successful API remove
    const handleSuccess = useCallback(() => {
        setIsApiPending(false);
        router.refresh();
        setIsModalOpen(false);
        setSelectedMember(null);
    }, [router, setIsApiPending]);
    // API error → rollback optimistic UI
    const handleError = useCallback(() => {
        setData(prevDataRef.current);
        setIsApiPending(false);
        setIsModalOpen(false);
        setSelectedMember(null);
    }, [setIsApiPending]);
    // Table columns
    const columns = useMemo(() => createAdminColumns(handleOpenModal), [handleOpenModal]);

    const table = useReactTable<GroupingGroupMember>({
        columns,
        data,
        getRowId: row => row.uid,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { globalFilter, sorting },
        initialState: { pagination: { pageSize } },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        enableMultiSort: true,
        enableSortingRemoval: false,
    });

    useEffect(() => {
        table.setSorting([{ id: 'name', desc: false }]);
    }, [table]);

    // Reset to page 1 when new admin added
    const prevLenRef = useRef<number>(data.length);
    useEffect(() => {
        if (data.length > prevLenRef.current) table.setPageIndex(0);
        prevLenRef.current = data.length;
    }, [data.length, table]);

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color pt-3">Manage Admins</h1>
                <div className="flex items-center space-x-2 md:w-60 lg:w-72">
                    <GlobalFilter placeholder="Filter Admins..." filter={globalFilter} setFilter={setGlobalFilter} />
                </div>
            </div>
            <Table className="table-fixed">
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()} className="w-1/3">
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
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id} className={`${cell.column.getIndex() > 0 ? 'hidden sm:table-cell' : ''}`}>
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
                    uids={data.map(m => m.uid)}
                    uhUuids={data.map(m => m.uhUuid)}
                    onOptimisticAdd={handleOptimisticAdd} // optimistic add
                />
                <div className="flex justify-end">
                    <PaginationBar table={table} />
                </div>
            </div>
            {/* Remove modal */}
            {selectedMember && (
                <RemoveMemberModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedMember(null);
                    }}
                    memberToRemove={selectedMember}
                    group="admins"
                    groupingPath=""
                    onSuccess={handleSuccess}
                    onProcessing={handleOptimisticRemove} // optimistic remove
                    onError={handleError}
                />
            )}
            {/* Global Block Navigation Modal */}
            {BlockModalUI}
        </>
    );
};

export default dynamic(() => Promise.resolve(AdminTable), {
    ssr: false,
    loading: () => <AdminTableSkeleton />,
});
