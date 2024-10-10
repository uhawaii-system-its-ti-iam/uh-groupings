import TooltipOnTruncate from '@/components/table/table-element/tooltip-on-truncate';

const GroupingDescriptionCell = ({ description }: { description: string }) => {
    return (
        <TooltipOnTruncate value={description}>
            <div className="truncate sm:max-w-[calc(6ch+1em)] md:max-w-full">{description}</div>
        </TooltipOnTruncate>
    );
};

export default GroupingDescriptionCell;
