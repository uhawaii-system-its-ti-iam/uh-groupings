'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { memberAttributeResults } from '@/lib/actions';
import AddMemberModal from '@/components/modal/add-member-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from '@/components/ui/tooltip';
import { useState } from 'react';
import { GroupingGroupMember, MemberResult } from '@/lib/types';

const AddAdmin = ({uids, uhUuids, onAddAdmin,}: {uids: string[]; uhUuids: string[]; onAddAdmin: (member: GroupingGroupMember) => Promise<void>; }) => {
    const { register, getValues, reset } = useForm<{ uhIdentifier: string }>();
    const [selectedUser, setSelectedUser] = useState<MemberResult | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isError, setError] = useState('');
    const validateInput = (input: string) => {
        if (!input) return 'You must enter a UH member to search';
        if (input.includes(' ') || input.includes(','))
            return 'You can only add one UH member at a time';
        if (uids.includes(input) || uhUuids.includes(input))
            return `${input} is already an admin`;
        return '';
    };

    const handleSearch = async () => {
        const identifier = getValues('uhIdentifier')?.trim();
        const validationError = validateInput(identifier);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError('');
        try {
            const data = await memberAttributeResults([identifier]);

            if (data?.results?.length) {
                setSelectedUser(data.results[0]);
                setIsAddModalOpen(true);
            } else {
                setError('No valid user data found');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to search user');
        }
    };

    const handleAddAdmin = async () => {
        const admin: GroupingGroupMember = {
            resultCode: 'SUCCESS',
            uid: selectedUser!.uid,
            name: selectedUser!.name,
            uhUuid: selectedUser!.uhUuid,
            firstName: selectedUser!.firstName,
            lastName: selectedUser!.lastName,
        };
        try {
            reset();
            setIsAddModalOpen(false);
            setSelectedUser(null);
            await onAddAdmin(admin);
        } catch (err) {
            console.error(err);
            setError('Failed to add admin');
        }
    };

    return (
        <>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    await handleSearch();
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
            </form>

            {selectedUser && (
                <AddMemberModal
                    open={isAddModalOpen}
                    uid={selectedUser.uid}
                    name={selectedUser.name}
                    uhUuid={selectedUser.uhUuid}
                    group="admins"
                    onConfirm={handleAddAdmin}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </>
    );
};

export default AddAdmin;
