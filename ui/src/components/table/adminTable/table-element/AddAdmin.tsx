import {Input} from '@/components/ui/input'
import {Dispatch, SetStateAction} from 'react';
import {Button} from '@/components/ui/button';
import {addAdmin} from '@/actions/groupings-api';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';

interface InputProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

const handleClick = (input: string) => {
    //create a condition where the admin list is checked for the uhid/uhUuid the user entered in.
    //if it does not exist in the admin list, add the new admin to the UH Groupings admin list.
    addAdmin(input);
};
const AddAdmin = ({input, setInput}: InputProps) => (
        //Add tooltip
        <div className="inline-flex" role="group">
            <Input
                className="rounded-r-none"
                placeholder={'UH Username or UH #'}
                value={input || ''}

                onChange={e => setInput(e.target.value)}
            />

            <Button
                className="rounded-l-none"
                onClick={() => handleClick(input)}
                >
                Add
            </Button>
        </div>
);

export default AddAdmin;

/*
const handleClick = () => {
  setTooltipContent('copied!');
  setTooltipVisible(true);
  setTimeout(() => {
    setTooltipContent('copy');
    setTooltipVisible(false);
  }, 2000);
};*/

/*<TooltipProvider>
  <Tooltip open={tooltipVisible} onOpenChange={setTooltipVisible}>
    <TooltipTrigger asChild>
      <button
        onClick={handleClick}
        className="relative flex-shrink-0 flex items-center
                             justify-center hover:bg-green-blue h-6 p-2"
      >
        <ClipboardIcon className="h-4 w-4 text-gray-600" />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltipContent}</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>*/
