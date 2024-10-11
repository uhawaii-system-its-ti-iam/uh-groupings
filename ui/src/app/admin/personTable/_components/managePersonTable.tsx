'use client';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Membership } from '@/lib/types';
import SortArrow from '@/components/table/table-element/sort-arrow';
import { SortingState, useReactTable } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import SearchInput from '@/app/admin/personTable/_components/searchInput';
import GlobalFilter from '@/components/table/table-element/global-filter';

const managePersonTable = ({ data }: { data: Membership[] }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    //const [sorting, setSorting] = useState<SortingState>([]);

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between pt-1 mb-1">
                <h1 className="text-[2rem] font-medium text-text-color pt-3">Manage Person</h1>
                <div className="flex flex-col md:flex-row md:justify-end pt-3 mb-1">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
                <SearchInput />
                <label>
                    <div>
                        Check All
                        <input className="mx-2" type="checkbox" name="checkAll" defaultChecked={false} />
                        <Button className="rounded-[-0.25rem] rounded-r-[0.25rem]" variant="destructive">
                            Remove
                        </Button>
                    </div>
                </label>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <div className="flex items-center">
                                Grouping
                                <SortArrow direction={'asc'} />
                            </div>
                        </TableHead>
                        <TableHead>Owner?</TableHead>
                        <TableHead>Basis?</TableHead>
                        <TableHead>Include?</TableHead>
                        <TableHead>Exclude?</TableHead>
                        <TableHead>Remove</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody></TableBody>
            </Table>
        </>
    );
};

export default managePersonTable;
