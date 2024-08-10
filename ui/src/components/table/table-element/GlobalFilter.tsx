import { Input } from '@/components/ui/input'
import {Dispatch, SetStateAction} from 'react';

interface FilterProps {
    placeholder: string;
    filter: string;
    setFilter:  Dispatch<SetStateAction<string>>;
}
const GlobalFilter = ({placeholder, filter, setFilter} : FilterProps) => (
    <Input
        placeholder= {placeholder || 'Filter Results...'}
        value={filter || ''}

        onChange={e => setFilter(e.target.value)}
    />

);

export default GlobalFilter;
