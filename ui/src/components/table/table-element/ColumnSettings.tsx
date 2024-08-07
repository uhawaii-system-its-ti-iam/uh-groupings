'use client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';

const ColumnSettings = ({ table }) => {
    const [description, setDescription] = useState(true);
    const [groupingPath, setGroupingPath] = useState(true);

    const toggleDescription = () => {
        setDescription((prevState) => {
            const newState = !prevState;
            table.getColumn('DESCRIPTION')?.toggleVisibility(newState);
            return newState;
        });
    };

    const toggleGroupingPath = () => {
        setGroupingPath((prevState) => {
            const newState = !prevState;
            table.getColumn('GROUPING PATH')?.toggleVisibility(newState);
            return newState;
        });
    };

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border border-gray-300 hover:bg-transparent">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-text-color">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/>
                        </svg>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup>
                        <DropdownMenuRadioItem value="description" className="px-2">
                            <div className="flex items-center space-x-2">
                                <Switch id="description" checked={description} onCheckedChange={toggleDescription} className="data-[state=checked]:bg-uh-teal"/>
                                <Label htmlFor="description">Description</Label>
                            </div>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="grouping path" className="px-2">
                            <div className="flex items-center space-x-2">
                                <Switch id="grouping-path" checked={groupingPath} onCheckedChange={toggleGroupingPath}  className="data-[state=checked]:bg-uh-teal"/>
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