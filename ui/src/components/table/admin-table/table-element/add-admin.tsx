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
    //TODO: create a condition where the admin list is checked for the uhid/uhUuid the user entered in.
    //TODO: if it does not exist in the admin list, add the new admin to the UH Groupings admin list.
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
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="rounded-l-none"
                            onClick={() => handleClick(input)}
                        >
                            Add
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add to admins</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
);

export default AddAdmin;
