'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TooltipOnTruncate = ({ children, value }: { children: React.ReactNode; value: string }) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const checkIsTruncated = () => {
            if (ref.current) {
                setIsTruncated(ref.current.scrollWidth > ref.current.clientWidth);
            }
        };
        checkIsTruncated();
        window.addEventListener('resize', checkIsTruncated);
        return () => window.removeEventListener('resize', checkIsTruncated);
    }, []);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild ref={ref}>
                    {children}
                </TooltipTrigger>
                {isTruncated && (
                    <TooltipContent className="max-w-[190px] max-h-[180px] text-center whitespace-normal break-words bg-black text-white">
                        <p data-testid="tooltip-on-truncate">{value}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
};

export default TooltipOnTruncate;
