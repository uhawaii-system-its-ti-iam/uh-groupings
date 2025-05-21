import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { memberAttributeResults } from '@/lib/actions';
import AddMemberModal from '@/components/modal/add-member-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { addAdmin } from '@/lib/actions';
import { useState } from 'react';
import { MemberResult } from '@/lib/types';

const AddAdmin = ({ uids, uhUuids }: { uids: string[]; uhUuids: string[] }) => {
    const { register, getValues, reset } = useForm<{ uhIdentifier: string }>();
    const [isSelectedUser, setSelectedUser] = useState<MemberResult | null>(null);
    const [isError, setError] = useState('');

    const validateInput = (input: string) => {
        if (!input) return 'You must enter a UH member to search';
        if (input.includes(' ') || input.includes(',')) return 'You can only add one UH member at a time';
        if (uids.includes(input) || uhUuids.includes(input)) return `${input} is already an admin`;
        return '';
    };

    const handleClick = async () => {
        const identifier = getValues('uhIdentifier').trim();
        const validationError = validateInput(identifier);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');

        const data = await memberAttributeResults([identifier]);

        if (data?.results?.length) {
            setSelectedUser(data.results[0]);
        } else {
            setError('No valid user data found');
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleClick();
            }}
            className="flex flex-col"
        >
            <div className="flex items-center">
                <Input
                    className="rounded-r-none md:w-96 w-full"
                    placeholder="UH Username or UH Number"
                    {...register('uhIdentifier')}
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="submit" className="rounded-l-none">
                                Add
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add to admins list</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {isError && (
                <Alert className="my-4 w-fit max-w-sm" variant="destructive">
                    <AlertDescription>{isError}</AlertDescription>
                </Alert>
            )}
            {isSelectedUser && (
                <AddMemberModal
                    uid={isSelectedUser.uid}
                    name={isSelectedUser.name}
                    uhUuid={isSelectedUser.uhUuid}
                    group={'admins'}
                    action={addAdmin}
                    onClose={() => {
                        setSelectedUser(null);
                    }}
                    onSuccess={() => reset()}
                />
            )}
        </form>
    );
};

export default AddAdmin;
