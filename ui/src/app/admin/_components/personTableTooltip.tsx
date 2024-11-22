'use client';
import React, { useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from '@/components/ui/tooltip';
import { Side } from '@floating-ui/utils';

const PersonTableTooltip = ({
    desc,
    value,
    side
}: {
    desc: React.ReactNode;
    value: string;
    side: Side | undefined;
}) => {
    const ref = useRef<HTMLButtonElement>(null);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild ref={ref}>
                    {desc}
                </TooltipTrigger>
                <TooltipContent
                    className="max-w-[190px] max-h-[180px] text-center whitespace-normal break-words
                    bg-black text-white "
                    side={side}
                >
                    <TooltipArrow />
                    <p data-testid="person-table-tooltip">{value}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default PersonTableTooltip;
