'use client';

import {
    flexRender,
    functionalUpdate,
    getCoreRowModel,
    PaginationState,
    SortingState,
    Updater,
    useReactTable
} from '@tanstack/react-table';
import GroupingMembersTableColumns from './table-element/grouping-members-table-columns';
import { Group, GroupingGroupMembers, MemberResult } from '@/lib/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import SortArrow from '@/components/table/table-element/sort-arrow';
import ListManagement from '@/components/table/table-element/list-management';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import RemoveMemberModal from '@/components/modal/remove-member-modal';
import RemoveMembersModal from '@/components/modal/remove-members-modal';
import SuccessModal from '@/components/modal/success-modal';
import { useEffect, useState, useTransition } from 'react';
import GlobalFilter from '@/components/table/table-element/global-filter';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { getGroupingMembersIsBasis, getGroupingMembersWhereListed, getNumberOfGroupingMembers } from '@/lib/actions';
import {
    parseAsBoolean,
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
    useQueryState,
    UseQueryStateOptions,
    useQueryStates
} from 'nuqs';
import SortBy, {
    findSortBy
} from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/table-element/sort-by';
import { useRouter } from 'next/navigation';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

export type GroupingMembersTableSearchParams = {
    page: string;
    sortBy: string;
    isAscending: string;
    search?: string;
};

const GroupingMembersTable = ({
    groupingGroupMembers,
    groupingPath,
    group
}: {
    groupingGroupMembers: GroupingGroupMembers;
    groupingPath: string;
    group?: Group;
}) => {
    const { members, size } = groupingGroupMembers;
    const queryStateOptions: Omit<UseQueryStateOptions<string>, 'parse'> = {
        history: 'replace',
        scroll: false,
        shallow: false
    };

    // Pagination.
    const [page, setPage] = useQueryState('page', parseAsInteger.withOptions(queryStateOptions).withDefault(1));
    const pagination: PaginationState = {
        pageIndex: page - 1,
        pageSize
    };
    const onPaginationChange = (updater: Updater<PaginationState>) => {
        const updatedPagination = functionalUpdate(updater, pagination);
        setPage(updatedPagination.pageIndex + 1);
    };

    // Sorting.
    const [sort, setSort] = useQueryStates({
        sortBy: parseAsStringEnum<SortBy>(Object.values(SortBy))
            .withOptions(queryStateOptions)
            .withDefault(SortBy.NAME),
        isAscending: parseAsBoolean.withOptions(queryStateOptions).withDefault(true)
    });
    const sorting: SortingState = [{ id: sort.sortBy, desc: !sort.isAscending }];
    const onSortingChange = (updater: Updater<SortingState>) => {
        const updatedSorting = functionalUpdate(updater, sorting);
        const { id, desc } = updatedSorting[0];
        setSort({
            sortBy: findSortBy(id),
            isAscending: !desc
        });
    };

    // Global Filter.
    const [isSearchLoading, startTransition] = useTransition();
    const [globalFilter, setGlobalFilter] = useQueryState(
        'search',
        parseAsString.withOptions({ ...queryStateOptions, startTransition, throttleMs: 200 }).withDefault('')
    );
    const onGlobalFilterChange = () => {
        setPage(1);
    };

    // Fetch number of grouping members.
    const groupPath = group ? groupingPath + ':' + group : groupingPath;

    const {
        data: rowCount = 0,
        isPending: isRowCountPending,
        refetch: refetchRowCount
    } = useQuery({
        queryKey: [groupPath, 'rowCount'],
        queryFn: () => getNumberOfGroupingMembers(groupPath)
    });

    const uhUuids = members.map((member) => member.uhUuid);

    // Fetch isBasis data.
    const { data: groupingMembersIsBasis = members, isPending: isBasisPending } = useQuery({
        staleTime: Infinity, // The basis group members rarely change.
        enabled: members.length > 0 && !['basis', 'owners', undefined].includes(group),
        queryKey: [`${groupingPath}:basis`, uhUuids],
        queryFn: () => getGroupingMembersIsBasis(groupingPath, uhUuids).then((res) => res.members)
    });

    // Fetch whereListed data.
    const { data: groupingMembersWhereListed = members, isPending: isWhereListedPending } = useQuery({
        enabled: members.length > 0 && !group,
        queryKey: [groupingPath, uhUuids],
        queryFn: () => getGroupingMembersWhereListed(groupingPath, uhUuids).then((res) => res.members)
    });

    // List Management (Member Removal).
    const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
    const [isRemoveMembersModalOpen, setIsRemoveMembersModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [memberToManage, setMemberToManage] = useState<GroupingGroupMembers['members'][0]>(null);
    const [membersToManage, setMembersToManage] = useState<GroupingGroupMembers['members']>([]);
    const [membersToManageCount, setMembersToManageCount] = useState(0);
    const [manageType, setManageType] = useState<string>('');
    const router = useRouter();
    const [rowSelection, setRowSelection] = useState({});
    const [isPerformingRemoval, setIsPerformingRemoval] = useState(false);

    const handleOpenManageMemberModal = (manageType: string, membersInList: GroupingGroupMembers['members']) => {
        if (membersInList.length === 1) {
            const member = membersInList[0];
            const validUid = member.uid?.trim() ? member.uid : 'N/A';
            setManageType(manageType);

            setMemberToManage({
                groupPath: '',
                members: [],
                size: 0,
                resultCode: '',
                whereListed: '',
                uid: validUid,
                name: member.name,
                uhUuid: member.uhUuid,
                firstName: member.firstName,
                lastName: member.lastName
            });

            switch (manageType) {
                case 'removeMembers':
                    setIsRemoveMemberModalOpen(true);
                    break;
                case 'addMembers':
                    console.log('Open Add Members Modal ');
                    break;
                default:
                    console.error(`Unknown manage type: ${manageType}`);
                    return;
            }

            setMembersToManageCount(1);
        } else {
            console.error('handleOpenRemoveMemberModal expects exactly one member.');
        }
    };

    const handleOpenManageMembersModal = (manageType: string, membersInList: GroupingGroupMembers['members']) => {
        const validMembers = membersInList.map((member) => {
            const validUid = !member.uid || member.uid.trim() === '' ? 'N/A' : member.uid;
            return {
                groupPath: '',
                members: [],
                size: 0,
                resultCode: '',
                whereListed: '',
                uid: validUid,
                name: member.name,
                uhUuid: member.uhUuid,
                firstName: member.firstName,
                lastName: member.lastName
            };
        });

        setManageType(manageType);
        setMembersToManage(validMembers);
        setMembersToManageCount(validMembers.length);

        // Condition which modal to open based on manageType

        switch (manageType) {
            case 'removeMembers':
                setIsRemoveMembersModalOpen(true);
                break;
            case 'addMembers':
                console.log('Open Add Members Modal ');
                break;
            default:
                console.error(`Unknown manage type: ${manageType}`);
                return;
        }
    };

    // dynamic handle successful management of a member(s).
    const handleManageMemberSuccess = () => {
        setIsRemoveMemberModalOpen(false);
        setIsRemoveMembersModalOpen(false);
        setIsPerformingRemoval(false);
        setIsSuccessModalOpen(true);
    };

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
        setIsRefreshing(true);
        startTransition(() => {
            refetchRowCount().then(() => {
                router.refresh();
                setRowSelection({});
                setSelectedMembers({});
                setMemberToManage(null);
                setMembersToManage([]);
                setManageType('');
                setTimeout(() => {
                    setIsRefreshing(false);
                }, 1500);
            });
        });
    };

    // For Checkbox Selection
    const [selectedMembers, setSelectedMembers] = useState<Record<string, MemberResult>>({});
    const handleRowSelectionChange = (updater: Updater<Record<string, boolean>>) => {
        const newRowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
        setRowSelection(newRowSelection);

        setSelectedMembers((prevSelectedMembers) => {
            const newSelectedMembers = { ...prevSelectedMembers };

            table.getRowModel().rows.forEach((row) => {
                if (newRowSelection[row.id] && !newSelectedMembers[row.id]) {
                    newSelectedMembers[row.id] = row.original as MemberResult;
                }
            });

            Object.keys(newSelectedMembers).forEach((uhUuid) => {
                if (!newRowSelection[uhUuid]) {
                    delete newSelectedMembers[uhUuid];
                }
            });

            return newSelectedMembers;
        });
    };

    // Reset selection when groupingPath, group, or globalFilter changes.
    useEffect(() => {
        setRowSelection({});
        setSelectedMembers({});
    }, [groupingPath, group, globalFilter]);

    const checkedMembers = Object.values(selectedMembers);

    const table = useReactTable({
        columns: GroupingMembersTableColumns(
            handleOpenManageMemberModal,
            group,
            !group ? isWhereListedPending : isBasisPending
        ),
        data: !group ? groupingMembersWhereListed : groupingMembersIsBasis,
        rowCount: rowCount,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange,
        onSortingChange,
        onRowSelectionChange: handleRowSelectionChange,
        state: { pagination, sorting, rowSelection },
        manualPagination: true,
        manualSorting: true,
        enableSortingRemoval: false,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        getRowId: (row: MemberResult) => row.uhUuid
    });

    return (
        <div className="px-4 py-1">
            {isRefreshing && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative flex items-center justify-center h-full">
                        <Spinner size="lg" show={true} className="text-white" />
                    </div>
                </div>
            )}
            <div className={`${isRefreshing ? 'opacity-25 pointer-events-none' : ''}`}>
                <div className="flex flex-col md:flex-row md:justify-between">
                    <h1 className="flex font-bold text-[32px] capitalize">
                        {group ?? 'All Members'}
                        <span className="ml-2 flex items-center">
                            <span>({rowCount})</span>
                            {(isRowCountPending || isRefreshing) && (
                                <Spinner size="sm" show={true} className="ml-2 text-black stroke-[3.0]" />
                            )}
                        </span>
                    </h1>
                    <div className="md:w-60 lg:w-72">
                        <GlobalFilter
                            placeholder="Filter Members..."
                            filter={globalFilter}
                            setFilter={setGlobalFilter}
                            onFilterChange={onGlobalFilterChange}
                            isLoading={isSearchLoading}
                        />
                    </div>
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
                                    className={`
                                      ${header.id === 'select' ? 'w-[10%] sm:w-12' : ''}
                                      ${
                                          header.id === 'name'
                                              ? group === 'owners'
                                                  ? 'w-[65%] overflow-hidden'
                                                  : ['include', 'exclude'].includes(group || '')
                                                    ? 'w-[35%] md:w-2/5 overflow-hidden'
                                                    : 'w-[30%]'
                                              : ''
                                      }
                                      ${
                                          ['uhUuid', 'uid'].includes(header.id)
                                              ? ['include', 'exclude'].includes(group || '')
                                                  ? 'w-[20%] whitespace-normal sm:whitespace-nowrap'
                                                  : ''
                                              : ''
                                      }
                                      ${
                                          header.id === 'whereListed'
                                              ? ['include', 'exclude'].includes(group || '')
                                                  ? 'w-[15%]'
                                                  : 'w-[30%]'
                                              : ''
                                      }
                                      whitespace-normal px-2 md:px-4 [vertical-align:bottom] md:[vertical-align:middle]
                                    `}
                                >
                                    <div
                                        className={`
                                          ${header.id === 'select' ? 'flex items-center px-2 pb-[5px] md:pb-0' : ''}
                                          ${['uhUuid', 'uid'].includes(header.id) ? 'flex flex-col md:flex-row' : 'flex flex-row'}
                                          ${['name'].includes(header.id) ? 'flex items-center' : ''}
                                          flex items-start md:items-center  
                                        `}
                                    >
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
                                    className={`
                                      ${cell.column.id === 'select' ? 'w-[10%] px-4 sm:w-12' : ''}
                                      ${
                                          cell.column.id === 'name'
                                              ? group === 'owners'
                                                  ? 'w-[65%] overflow-hidden'
                                                  : ['include', 'exclude'].includes(group || '')
                                                    ? 'w-[35%] md:w-2/5 overflow-hidden'
                                                    : 'w-[30%]'
                                              : ''
                                      }
                                      ${
                                          ['uhUuid', 'uid'].includes(cell.column.id)
                                              ? ['include', 'exclude'].includes(group || '')
                                                  ? 'w-[20%] '
                                                  : ''
                                              : ''
                                      }
                                      ${
                                          cell.column.id === 'whereListed'
                                              ? ['include', 'exclude'].includes(group || '')
                                                  ? 'w-[15%]'
                                                  : ''
                                              : ''
                                      }
                                      whitespace-normal
                                    `}
                                >
                                    <div
                                        className={`
                                          ${cell.column.id === 'select' ? 'flex items-start px-0 md:px-2' : ''}
                                          ${['name', 'uhUuid', 'uid', 'whereListed'].includes(cell.column.id) ? 'flex items-start px-2 py-1.5 md:px-4' : ''}
                                        `}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {group === 'include' || group === 'exclude' || group === 'owners' ? (
                <ListManagement
                    list={group}
                    groupingPath={groupingPath}
                    onOpenManageMemberModal={handleOpenManageMemberModal}
                    onOpenManageMembersModal={handleOpenManageMembersModal}
                    checkedMembers={checkedMembers}
                    isPerformingRemoval={isPerformingRemoval}
                />
            ) : null}
            {memberToManage && (
                <RemoveMemberModal
                    isOpen={isRemoveMemberModalOpen}
                    onClose={() => {
                        setIsRemoveMemberModalOpen(false);
                    }}
                    memberToRemove={memberToManage}
                    group={group || 'null'}
                    groupingPath={groupingPath}
                    onSuccess={handleManageMemberSuccess}
                    onProcessing={() => setIsPerformingRemoval(true)}
                />
            )}
            {membersToManage && (
                <RemoveMembersModal
                    isOpen={isRemoveMembersModalOpen}
                    onClose={() => {
                        setIsRemoveMembersModalOpen(false);
                    }}
                    membersToRemove={membersToManage}
                    group={group || 'null'}
                    groupingPath={groupingPath}
                    onSuccess={handleManageMemberSuccess}
                    onProcessing={() => setIsPerformingRemoval(true)}
                />
            )}
            {/*addMembersModal :*/}
            {isSuccessModalOpen && (
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={handleCloseSuccessModal}
                    name={membersToManageCount === 1 ? memberToManage?.name || membersToManage[0]?.name || '' : ''}
                    group={group}
                    manageType={manageType}
                    memberCount={membersToManageCount}
                />
            )}

            <PaginationBar table={table} groupingPath={groupingPath} />
        </div>
    );
};

export default GroupingMembersTable;
