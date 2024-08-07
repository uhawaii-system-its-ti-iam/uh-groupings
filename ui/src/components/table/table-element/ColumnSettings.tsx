'use client';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import {faSliders} from "@fortawesome/free-solid-svg-icons";

const ColumnSettings = ({table}) => {
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
                    <Button
                        variant="outline"
                        className="border border-gray-300 hover:bg-transparent"
                        aria-label="Column settings"
                    >
                        <FontAwesomeIcon
                            icon={faSliders}
                            className="w-5 h-5 text-text-color"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="description"
                                checked={description}
                                onCheckedChange={toggleDescription}
                                className="data-[state=checked]:bg-uh-teal"
                                aria-label="Toggle Description column"
                            />
                            <Label htmlFor="description">Description</Label>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="grouping-path"
                                checked={groupingPath}
                                onCheckedChange={toggleGroupingPath}
                                className="data-[state=checked]:bg-uh-teal"
                                aria-label="Toggle Grouping Path column"
                            />
                            <Label htmlFor="grouping-path">Grouping Path</Label>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ColumnSettings;
