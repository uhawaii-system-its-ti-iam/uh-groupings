import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminTableColumns from '@/app/admin/_components/admin-table/table-element/admin-table-columns';

const AdminTableSkeleton = () => {
    const pageSize = 7; // Average number of rows

    return (
        <div className="mb-12">
            <div className="h-full flex flex-col md:flex-row md:justify-between pt-5 mb-4">
                <h1 className="text-[2rem] font-medium text-text-color text-center pt-3">Manage Admins</h1>
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
                        {AdminTableColumns.map((column) => (
                            <TableHead key={`header-${column}`} className={`pl-[0.5rem]`}>
                                <Skeleton className="h-5 w-36 rounded-[0.25rem]" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from(Array(pageSize), (_, index) => (
                        <TableRow key={index}>
                            {AdminTableColumns.map((column) => (
                                <TableCell key={`header-${column}`} className={`p-[0.5rem]`}>
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

export default AdminTableSkeleton;
