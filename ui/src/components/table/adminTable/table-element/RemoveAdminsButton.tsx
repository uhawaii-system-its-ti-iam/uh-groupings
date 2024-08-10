import { Trash2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

const RemoveAdminsButton = (/*{ uniqueId }*/) => {
    const [tooltipContent] = useState('Remove this administrator (there must be at least 1 remaining).');
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleClick = () => {
        setTooltipVisible(false);
    };

    return (
        <div className="flex items-center w-full">
            <TooltipProvider>
                <Tooltip open={tooltipVisible} onOpenChange={setTooltipVisible}>
                    <TooltipTrigger asChild>
                        <Trash2Icon
                          onClick={handleClick}
                          className="h-4 w-4 text-red-600"
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltipContent}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default RemoveAdminsButton;
