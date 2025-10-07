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
import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react';
import { useOptimistic } from 'react';
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

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data, setData] = useState(groupingGroupMembers.members);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<GroupingGroupMember | null>(null);

    const { BlockModalUI, setIsApiPending } = useBlockNavigation();

    // Sync new server data
    useEffect(() => {
        setData(groupingGroupMembers.members);
    }, [groupingGroupMembers.members]);

    // Optimistic State
    const [optimisticData, applyOptimistic] = useOptimistic(
        data,
        (prev, updatedList: GroupingGroupMember[]) => updatedList
    );

    /* Optimistic Add */
    const optimisticAdd = useCallback(
        (member: GroupingGroupMember) => {
            const newList = [member, ...optimisticData];
            applyOptimistic(newList);
        },
        [optimisticData, applyOptimistic]
    );

    const handleOptimisticAdd = useCallback(
        async (newAdmin: GroupingGroupMember) => {
            setIsApiPending(true);

            // Immediately render optimistic UI
            startTransition(() => {
                optimisticAdd(newAdmin);
            });

            try {
                await addAdmin(newAdmin.uid);
            } catch (e) {
                alert('Failed to add admin.');
            } finally {
                setIsApiPending(false);
                router.refresh(); // React 19 rollback/commit
            }
        },
        [optimisticAdd, router, setIsApiPending]
    );

    /* Optimistic Remove */
    const optimisticRemove = useCallback(
        (member: GroupingGroupMember) => {
            const newList = optimisticData.filter(m => m.uid !== member.uid);
            applyOptimistic(newList);
        },
        [optimisticData, applyOptimistic]
    );

    const handleOptimisticRemove = useCallback(() => {
        if (!selectedMember) return;

        setIsApiPending(true);

        startTransition(() => {
            optimisticRemove(selectedMember);
        });
    }, [selectedMember, optimisticRemove, setIsApiPending]);

    /* Modal callbacks */
    const handleOpenModal = useCallback((member: GroupingGroupMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    }, []);

    const handleSuccess = useCallback(() => {
        setIsApiPending(false);
        router.refresh();
        setIsModalOpen(false);
        setSelectedMember(null);
    }, [router, setIsApiPending]);

    const handleError = useCallback(() => {
        setIsApiPending(false);
        setIsModalOpen(false);
        setSelectedMember(null);
        router.refresh(); // rollback
    }, [router, setIsApiPending]);

    /* Table Setup */
    const columns = useMemo(() => createAdminColumns(handleOpenModal), [handleOpenModal]);

    const table = useReactTable<GroupingGroupMember>({
        columns,
        data: optimisticData,
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

    const prevLenRef = useRef(optimisticData.length);
    useEffect(() => {
        if (optimisticData.length > prevLenRef.current) {
            table.setPageIndex(0);
        }
        prevLenRef.current = optimisticData.length;
    }, [optimisticData.length, table]);

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
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
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
                    uids={optimisticData.map(m => m.uid)}
                    uhUuids={optimisticData.map(m => m.uhUuid)}
                    onOptimisticAdd={handleOptimisticAdd}
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
                    memberToRemove={selectedMember}
                    group="admins"
                    groupingPath=""
                    onSuccess={handleSuccess}
                    onProcessing={handleOptimisticRemove}
                    onError={handleError}
                />
            )}

            {BlockModalUI}
        </>
    );
};

export default dynamic(() => Promise.resolve(AdminTable), {
    ssr: false,
    loading: () => <AdminTableSkeleton />,
});
