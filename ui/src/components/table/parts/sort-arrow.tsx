import { ChevronUp, ChevronDown } from 'lucide-react';

const SortArrow = ({ direction }: { direction: string | boolean }) => (
    <div>
        {direction === 'desc' ? (
            <ChevronUp size={15} strokeWidth={3} data-testid="chevron-up-icon" />
        ) : direction === 'asc' ? (
            <ChevronDown size={15} strokeWidth={3} data-testid="chevron-down-icon" />
        ) : null}
    </div>
);

export default SortArrow;
