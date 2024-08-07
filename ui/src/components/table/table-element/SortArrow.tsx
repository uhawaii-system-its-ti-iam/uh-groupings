import { ChevronUp, ChevronDown } from 'lucide-react';

interface SortArrowProps {
    direction: string | boolean;
}

const SortArrow = ({ direction }: SortArrowProps) => (
    <div>
        {direction === 'asc' ? (
            <ChevronUp size={15} strokeWidth={3} />
        ) : direction === 'desc' ? (
            <ChevronDown size={15} strokeWidth={3} />
        ) : null}
    </div>
);

export default SortArrow;