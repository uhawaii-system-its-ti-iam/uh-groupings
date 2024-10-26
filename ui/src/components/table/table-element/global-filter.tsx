/*import { Input } from '@/components/ui/input';
import { Dispatch, SetStateAction } from 'react';

const GlobalFilter = ({ filter, setFilter }: { filter: string; setFilter: Dispatch<SetStateAction<string>> }) => (
    <Input placeholder="Filter Groupings..." value={filter || ''} onChange={(e) => setFilter(e.target.value)} />
);

export default GlobalFilter;*/

import { Input } from '@/components/ui/input';
import { Dispatch, SetStateAction } from 'react';

const GlobalFilter = ({ placeholder, filter, setFilter }: { placeholder: string; filter: string; setFilter: Dispatch<SetStateAction<string>> }) => (
  <Input placeholder={placeholder} value={filter || ''} onChange={(e) => setFilter(e.target.value)} />
);

export default GlobalFilter;
