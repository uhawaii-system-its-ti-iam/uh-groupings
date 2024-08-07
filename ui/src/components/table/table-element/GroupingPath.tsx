import { ClipboardIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

const GroupingPath = ({ data, uniqueId }) => {
    const [tooltipContent, setTooltipContent] = useState('copy');
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleClick = () => {
        setTooltipContent('copied!');
        setTooltipVisible(true);
        setTimeout(() => {
            setTooltipContent('copy');
            setTooltipVisible(false);
        }, 2000);
    };

    return (
        <div className="flex items-center w-full outline outline-1 rounded h-6 m-1">
            <Input
                id={`dataInput-${uniqueId}`}
                value={data}
                readOnly
                className="flex-1 h-6 text-input-text-grey text-[0.875rem]
                 border-none rounded-none w-[161] truncate"
            />
            <TooltipProvider>
                <Tooltip open={tooltipVisible} onOpenChange={setTooltipVisible}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={handleClick}
                            className="relative flex-shrink-0 flex items-center
                             justify-center hover:bg-green-blue h-6 p-2"
                        >
                            <ClipboardIcon className="h-4 w-4 text-gray-600" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltipContent}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default GroupingPath;