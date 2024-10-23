import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

const RemoveAdminsIcon = () => {
    const [tooltipContent] = useState('Remove this administrator (there must be at least 1 remaining).');
    const [tooltipVisible, setTooltipVisible] = useState(false);

    return (
        <div className="flex items-center w-full">
            <TooltipProvider>
                <Tooltip open={tooltipVisible} onOpenChange={setTooltipVisible}>
                    <TooltipTrigger asChild>
                        <Trash2Icon/>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltipContent}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default RemoveAdminsIcon;
