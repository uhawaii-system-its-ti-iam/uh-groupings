'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { Table } from '@tanstack/table-core';
import { GroupingPath } from '@/lib/types';

const ColumnSettings = ({ table }: { table: Table<GroupingPath> }) => {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="border border-gray-300 hover:bg-transparent"
                        aria-label="column-settings-button"
                    >
                        <FontAwesomeIcon icon={faSlidersH} className="w-5 h-5 text-text-color" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="hidden sm:block">
                    {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => (
                            <DropdownMenuItem className="px-2 capitalize" key={column.id}>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        data-testid={`${column.columnDef.header?.toString()} Switch`}
                                    />
                                    <Label htmlFor="description" className="text-[1rem]">
                                        {column.columnDef.header?.toString()}
                                    </Label>
                                </div>
                            </DropdownMenuItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default ColumnSettings;
