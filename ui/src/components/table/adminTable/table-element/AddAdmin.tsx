import { Input } from '@/components/ui/input'
import {Dispatch, SetStateAction} from 'react';
/*
import { addAdmin } from '@/actions/groupings-api';
*/
import { Button } from '@/components/ui/button';

interface InputProps {
  input: string;
  setInput:  Dispatch<SetStateAction<string>>;
}
const AddAdmin = ({input, setInput} : InputProps) => (
    <div className="flex items-center w-full outline outline-1 rounded h-6 m-1">
        <Input
            /*className="flex-1 h-6 text-input-text-grey text-[0.875rem]
            border-none rounded-none w-[161] truncate"*/
            placeholder={'UH Username or UH Number'}
            value={input || ''}

            onChange={e => setInput(e.target.value)}
        />
        <Button
          /*className="relative flex-shrink-0 flex items-center
          justify-center hover:bg-green-blue h-6 p-2"*/
          variant="default"
          /*onClick={() => addAdmin(input)}*/
        >
          Add
        </Button>
    </div>
);

export default AddAdmin;
