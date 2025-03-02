import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { memberAttributeResults } from '@/lib/actions';
import AddMemberModal from '@/components/modal/add-member-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { addAdmin } from '@/lib/actions';
import { useState } from 'react';
import useModal from '@/lib/hooks/use-modal';
import { MemberResult } from '@/lib/types';

const AddAdmin = ({ uids, uhUuids }: { uids: string[]; uhUuids: string[] }) => {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm<{ identifier: string }>();

    const [forceRender, setForceRender] = useState(0);
    const { openModal, closeModal, modal } = useModal();

    const onSubmit = async (data: { identifier: string }) => {
        clearErrors();

        if (uids.includes(data.identifier) || uhUuids.includes(data.identifier)) {
            setError('identifier', { message: `${data.identifier} is already an admin` });
            return;
        }

        const response = await memberAttributeResults([data.identifier]);

        if (response?.results?.length) {
            setForceRender((prev) => prev + 1);
            handleOpenModal(response.results[0]);
        } else {
            setError('identifier', { message: 'No valid user data found' });
        }
    };

    function handleOpenModal(member: MemberResult) {
        openModal(
            <AddMemberModal
                key={forceRender}
                uid={member.uid}
                name={member.name}
                uhUuid={member.uhUuid}
                group={'admins'}
                action={addAdmin}
                onClose={closeModal}
            />
        );
    }

    return (
        <div className="flex flex-col">
            <form className="flex items-center" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    className="rounded-r-none"
                    placeholder="UH Username or UH Number"
                    {...register('identifier', {
                        required: 'You must enter a UH member to search',
                        validate: (value) =>
                            value.includes(' ') || value.includes(',')
                                ? 'You can only add one UH member at a time'
                                : true
                    })}
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="submit">Add</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add to admins</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </form>

            {errors.identifier && (
                <Alert variant="destructive">
                    <AlertDescription>{errors.identifier.message}</AlertDescription>
                </Alert>
            )}
            {modal}
        </div>
    );
};

export default AddAdmin;
