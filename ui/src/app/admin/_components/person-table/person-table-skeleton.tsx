import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PersonTableColumns from '@/app/admin/_components/person-table/table-element/person-table-columns';

const PersonTableSkeleton = () => {
    const pageSize = 7; // Average number of rows

    return (
        <div className="mb-12">
            <Table className="mb-4">
                <TableHeader>
                    <TableRow>
                        {PersonTableColumns.map((column) => (
                            <TableHead key={`header-${column}`} className={`pl-[0.5rem]`}>
                                <Skeleton className="h-5 w-20 rounded-[0.25rem]" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from(Array(pageSize), (_, index) => (
                        <TableRow key={index}>
                            {PersonTableColumns.map((column) => (
                                <TableCell key={`header-${column}`} className={`p-[0.5rem]`}>
                                    <Skeleton
                                        className={`h-5 ${column.header === 'Grouping' ? 'w-96' : 'ms-5 w-1/4'}
                                        rounded-[0.25rem]`}
                                    />
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

export default PersonTableSkeleton;
