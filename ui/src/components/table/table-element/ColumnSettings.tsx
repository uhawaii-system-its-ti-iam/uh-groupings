'use client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { GroupingPath } from '@/models/groupings-api-results';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {Table} from '@tanstack/table-core';

interface ToggleProps {
    table: Table<GroupingPath>;
}
const ColumnSettings = ({ table } : ToggleProps) => {

    interface ColumnVisibilityState {
        DESCRIPTION: boolean;
        'GROUPING PATH': boolean;
    }

    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({
        DESCRIPTION: true,
        'GROUPING PATH': true,
    })

    const toggleColumnVisibility = (columnKey: keyof ColumnVisibilityState) => (checked: boolean) => {
        setColumnVisibility((prevState) => {
            const newState = checked;
            table.getColumn(columnKey)?.toggleVisibility(newState);
            return { ...prevState, [columnKey]: newState };
        });
    };

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline"
                            className="border border-gray-300 hover:bg-transparent"
                            data-testid="column-settings-button">
                        <FontAwesomeIcon icon={faSliders} className="w-5 h-5 text-text-color"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup>
                        <DropdownMenuRadioItem value="description" className="px-2">
                            <div className="flex items-center space-x-2">
                                <Switch id="description" checked={columnVisibility.DESCRIPTION}
                                        onCheckedChange={toggleColumnVisibility('DESCRIPTION')}
                                        className="data-[state=checked]:bg-uh-teal" data-testid="description-switch" />
                                <Label htmlFor="description">Description</Label>
                            </div>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="grouping path" className="px-2">
                            <div className="flex items-center space-x-2">
                                <Switch id="grouping-path" checked={columnVisibility['GROUPING PATH']}
                                        onCheckedChange={toggleColumnVisibility('GROUPING PATH')}
                                        className="data-[state=checked]:bg-uh-teal"
                                        data-testid="grouping-path-switch"/>
                                <Label htmlFor="grouping-path">Grouping Path</Label>
                            </div>
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ColumnSettings;
