import GroupingsTableColumns from '@/components/table/table-element/groupings-table-columns';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const GroupingsTableSkeleton = () => {
    const pageSize = 7; // Average number of rows

    return (
        <div className="mb-12">
            <div className="h-full flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color text-center pt-3">Manage Groupings</h1>
                <div className="flex items-center space-x-2 md:w-60 lg:w-72">
                    <Skeleton className="h-10 w-96 rounded-[0.25rem]" />
                    <div className="hidden sm:block">
                        <Skeleton className="h-10 w-10 rounded-[0.25rem]" />
                    </div>
                </div>
            </div>
            <Table className="mb-4">
                <TableHeader>
                    <TableRow>
                        {GroupingsTableColumns.map((column) => (
                            <TableHead
                                key={column.accessorKey}
                                className={`pl-[0.5rem]
                                ${column.accessorKey !== 'name' ? 'hidden sm:table-cell' : ''}`}
                            >
                                <Skeleton className="h-5 w-36 rounded-[0.25rem]" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from(Array(pageSize), (_, index) => (
                        <TableRow key={index}>
                            {GroupingsTableColumns.map((column) => (
                                <TableCell
                                    key={column.accessorKey}
                                    className={`p-[0.5rem]
                                    ${column.accessorKey !== 'name' ? 'hidden sm:table-cell' : ''}`}
                                >
                                    <Skeleton className="h-5 w-72 rounded-[0.25rem]" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="float-end">
                <Skeleton className="h-10 w-80 rounded-[0.25rem]" />
            </div>
        </div>
    );
};

export default GroupingsTableSkeleton;
