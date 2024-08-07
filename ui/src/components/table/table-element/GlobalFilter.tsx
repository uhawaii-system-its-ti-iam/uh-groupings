import { Input } from '@/components/ui/input'
import {Dispatch, SetStateAction} from 'react';

interface FilterProps {
    filter: string;
    setFilter:  Dispatch<SetStateAction<string>>;
}
const GlobalFilter = ( {filter, setFilter} : FilterProps) => (
    <Input
        placeholder='Filter Groupings...'
        value={filter || ''}

        onChange={e => setFilter(e.target.value)}
    />

);

export default GlobalFilter;