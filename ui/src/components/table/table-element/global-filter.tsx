import { Input } from '@/components/ui/input';
import { Dispatch, SetStateAction } from 'react';

const GlobalFilter = ({ placeholder, filter, setFilter }: { placeholder: string; filter: string; setFilter: Dispatch<SetStateAction<string>> }) => (
  <Input placeholder={placeholder} value={filter || ''} onChange={(e) => setFilter(e.target.value)} />
);

export default GlobalFilter;
