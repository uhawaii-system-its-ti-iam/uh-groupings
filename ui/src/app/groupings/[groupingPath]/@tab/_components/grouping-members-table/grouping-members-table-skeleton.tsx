import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import GroupingMembersTableColumns from './table-element/grouping-members-table-columns';
import { Group } from '@/lib/types';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const GroupingMembersTableSkeleton = ({ group }: { group?: Group }) => {
    return (
        <div className="px-4 py-1">
            <div className="flex flex-col md:flex-row md:justify-between">
                <h1 className="font-bold text-[32px] capitalize">{group ?? 'All Members'}</h1>
                <div className="md:w-60 lg:w-72">
                    <Skeleton className="h-10 w-72 rounded" />
                </div>
            </div>
            <Table className="table-fixed mb-4">
                <TableHeader>
                    <TableRow>
                        {GroupingMembersTableColumns().map((column, index) => (
                            <TableHead
                                key={`header-${column}-${index}`}
                                className={`pl-[0.5rem]
                                ${index > 0 ? 'hidden sm:table-cell' : ''}`}
                            >
                                <Skeleton className="h-4 w-36 rounded" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from(Array(pageSize), (_, index) => (
                        <TableRow key={`row-${index}`}>
                            {GroupingMembersTableColumns().map((column, index) => (
                                <TableCell
                                    key={`cell-${column}-${index}`}
                                    className={`p-[0.5rem]
                                    ${index > 0 ? 'hidden sm:table-cell' : ''}`}
                                >
                                    <Skeleton className="h-4 w-48 rounded" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="float-end">
                <Skeleton className="h-10 w-80 rounded" />
            </div>
        </div>
    );
};

export default GroupingMembersTableSkeleton;
