import { Input } from '@/components/ui/input'
import {Dispatch, SetStateAction} from 'react';
import {ClipboardIcon} from 'lucide-react';

interface InputProps {
  input: string;
  setInput:  Dispatch<SetStateAction<string>>;
}

const handleClick = () => {

};
const AddAdmin = ({input, setInput} : InputProps) => {
  return (
    <div>
        <Input
          placeholder={'UH Username or UH Number'}
          value={input}

          onChange={e => setInput(e.target.value)}
        />
        <button
          onClick={handleClick}
          className="relative flex-shrink-0 flex items-center
                                   justify-center hover:bg-green-blue h-6 p-2"
        >
          <ClipboardIcon className="h-4 w-4 text-gray-600"/>
        </button>
    </div>
  );
}

export default AddAdmin;
