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
import { Group, GroupingGroupMembers } from '@/lib/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import SortArrow from '@/components/table/table-element/sort-arrow';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import { useTransition } from 'react';
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
    const { data: rowCount = Infinity, isPending: isRowCountPending } = useQuery({
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

    const table = useReactTable({
        columns: GroupingMembersTableColumns(group, !group ? isWhereListedPending : isBasisPending),
        data: !group ? groupingMembersWhereListed : groupingMembersIsBasis,
        rowCount: globalFilter ? size : rowCount,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange,
        onSortingChange,
        state: { pagination, sorting },
        manualPagination: true,
        manualSorting: true,
        enableSortingRemoval: false
    });

    return (
        <div className="px-4 py-1">
            <div className="flex flex-col md:flex-row md:justify-between">
                <h1 className="flex font-bold text-[32px] capitalize">
                    {group ?? 'All Members'} {!isRowCountPending ? `(${rowCount})` : <Spinner className="ml-2" />}
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
            <Table className="table-fixed">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={`
                                      ${!table.getIsAllColumnsVisible() && header.column.getIndex() > 0 ? '' : ''}
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
