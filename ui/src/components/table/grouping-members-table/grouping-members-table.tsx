'use client';

import {
    flexRender,
    functionalUpdate,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    Updater,
    useReactTable
} from '@tanstack/react-table';
import GroupingMembersTableColumns from './table-element/grouping-members-table-columns';
import { GroupingGroupMember, GroupingMember } from '@/lib/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import SortArrow from '../table-element/sort-arrow';
import PaginationBar from '../table-element/pagination-bar';
import { useState, useTransition } from 'react';
import GlobalFilter from '../table-element/global-filter';
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
import SortBy, { findSortBy } from '../table-element/sort-by';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const GroupingMembersTable = ({
    groupingMembers,
    groupingPath,
    group
}: {
    groupingMembers: GroupingGroupMember[] | GroupingMember[];
    groupingPath: string;
    group?: string;
}) => {
    const queryStateOptions: Omit<UseQueryStateOptions<string>, 'parse'> = {
        history: 'replace',
        scroll: false,
        shallow: false
    };

    // Global Filter.
    const [isSearchLoading, startTransition] = useTransition();
    const [globalFilter, setGlobalFilter] = useQueryState(
        'search',
        parseAsString.withOptions({ ...queryStateOptions, startTransition, throttleMs: 200 }).withDefault('')
    );

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
    const [paginationClient, setPaginationClient] = useState(pagination);

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
    const [sortingClient, setSortingClient] = useState<SortingState>(sorting);

    // Fetch isBasis or whereListed data.
    const uhUuids = groupingMembers.map((groupingMember) => groupingMember.uhUuid);
    const { data: groupingMembersIsBasis = groupingMembers, isPending: isBasisPending } = useQuery({
        staleTime: Infinity, // The basis group members rarely change.
        enabled: groupingMembers.length > 0 && !['basis', 'owners', undefined].includes(group),
        queryKey: [`${groupingPath}:basis`, uhUuids],
        queryFn: () => getGroupingMembersIsBasis(groupingPath, uhUuids).then((res) => res.members)
    });
    const { data: groupingMembersWhereListed = groupingMembers, isPending: isWhereListedPending } = useQuery({
        enabled: groupingMembers.length > 0 && !group,
        queryKey: [groupingPath, uhUuids],
        queryFn: () => getGroupingMembersWhereListed(groupingPath, uhUuids).then((res) => res.members)
    });

    // Fetch number of grouping members.
    const groupPath = group ? groupingPath + ':' + group : groupingPath;
    const { data: count = Infinity, isPending: isCountPending } = useQuery({
        queryKey: [groupPath, 'count'],
        queryFn: () => getNumberOfGroupingMembers(groupPath)
    });

    const table = useReactTable({
        columns: GroupingMembersTableColumns(group, !group ? isWhereListedPending : isBasisPending),
        data: !group ? groupingMembersWhereListed : groupingMembersIsBasis,
        rowCount: globalFilter ? groupingMembers.length : count,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: globalFilter ? setPaginationClient : onPaginationChange,
        onSortingChange: globalFilter ? setSortingClient : onSortingChange,
        state: {
            pagination: globalFilter ? paginationClient : pagination,
            sorting: globalFilter ? sortingClient : sorting
        },
        manualPagination: !globalFilter,
        manualSorting: !globalFilter,
        enableSortingRemoval: false,
        autoResetPageIndex: false
    });

    return (
        <div className="px-4 py-1">
            <div className="flex flex-col md:flex-row md:justify-between">
                <h1 className="flex font-bold text-[32px] capitalize ">
                    {group ?? 'All Members'} {!isCountPending ? `(${count})` : <Spinner className="ml-2" />}
                </h1>
                <div className="md:w-60 lg:w-72">
                    <GlobalFilter
                        placeholder="Filter Members..."
                        filter={globalFilter}
                        setFilter={setGlobalFilter}
                        isLoading={isSearchLoading}
                    />
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
                                      ${!table.getIsAllColumnsVisible() && header.column.getIndex() > 0 ? 'w-1/3' : ''}
                                      ${header.column.getIndex() > 0 ? 'hidden sm:table-cell' : 'w-2/5 md:w-1/3'}
                                    `}
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
                                    className={`${cell.column.getIndex() > 0 ? 'hidden sm:table-cell' : ''}`}
                                >
                                    <div className="flex items-center px-5 py-1.5 overflow-hidden whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

export default GroupingMembersTable;
