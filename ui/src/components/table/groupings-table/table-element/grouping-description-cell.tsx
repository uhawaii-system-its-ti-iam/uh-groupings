import TooltipOnTruncate from '@/components/table/table-element/tooltip-on-truncate';

const GroupingDescriptionCell = ({ description }: { description: string }) => {
    return (
        <TooltipOnTruncate value={description}>
            <div className="truncate ml-4 pr-4 sm:mr-10 md:mr-2">{description}</div>
        </TooltipOnTruncate>
    );
};

export default GroupingDescriptionCell;
