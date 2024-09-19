import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import TooltipOnTruncate from '@/components/table/table-element/tooltip-on-truncate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';

const GroupingPathCell = ({ path }: { path: string }) => {
    const [tooltipContent, setTooltipContent] = useState('copy');
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleClick = async () => {
        await navigator.clipboard.writeText(path);
        setTooltipContent('copied!');
        setTooltipVisible(true);

        setTimeout(() => {
            setTooltipVisible(false);
            setTimeout(() => {
                setTooltipContent('copy'); // Reset content after the tooltip is hidden
            }, 1000);
        }, 2000);
    };

    return (
        <div className="flex items-center w-full outline outline-1 rounded h-6 m-1">
            <TooltipOnTruncate value={path}>
                <Input
                    id="dataInput"
                    value={path}
                    readOnly
                    className="flex-1 h-6 text-input-text-grey text-[0.875rem]
                        border-none rounded-none w-full truncate"
                />
            </TooltipOnTruncate>

            <TooltipProvider>
                <Tooltip open={tooltipVisible} onOpenChange={setTooltipVisible}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={handleClick}
                            className="group relative flex-shrink-0 flex items-center
                             justify-center hover:bg-green-blue h-6 p-2 transition ease-in-out duration-150"
                            data-testid="clipboard-button"
                        >
                            <FontAwesomeIcon className="group-hover:text-white h-4 w-4 text-gray-600" data-testid="clipboard-icon" icon={faClipboard} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p data-testid="tooltip">{tooltipContent}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default GroupingPathCell;
