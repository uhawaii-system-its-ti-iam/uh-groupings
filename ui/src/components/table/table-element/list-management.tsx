import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getMembersExistInInclude, getMembersExistInExclude, getMembersExistInOwners } from '@/lib/actions';
import { MemberResult } from '@/lib/types';
import { message } from '@/lib/messages';

const ListManagement = ({
    list,
    groupingPath,
    onOpenManageMemberModal,
    onOpenManageMembersModal,
    checkedMembers,
    isPerformingRemoval
}: {
    list: string;
    groupingPath: string;
    onOpenManageMemberModal: (manageType: string, membersInList: MemberResult[]) => void;
    onOpenManageMembersModal?: (manageType: string, membersInList: MemberResult[]) => void;
    checkedMembers?: MemberResult[];
    isPerformingRemoval: boolean;
}) => {
    const [manageMembers, setManageMembers] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMemSearchFocused, setIsMemSearchFocused] = useState(false);

    // Raw text input guard. Check for empty and invalid text characters (special characters).
    const handleRawTextInput = async () => {
        if (!manageMembers.trim() || manageMembers.split(/[,\s]+/).every((id) => id.trim() === '')) {
            setErrorMessage(message.ListManagement.ERROR.EMPTY_INPUT);
            return { success: false, rawTextInput: [], invalidTextInput: [] };
        }

        const rawTextInput = manageMembers
            .split(/[,\s]+/)
            .map((id) => id.trim())
            .filter((id) => id !== '');

        const invalidTextInput = rawTextInput.filter((id) => !/^[a-zA-Z0-9]+$/.test(id));
        const validTextInput = rawTextInput.filter((id) => /^[a-zA-Z0-9]+$/.test(id));

        if (invalidTextInput.length > 0) {
            setErrorMessage(message.ListManagement.ERROR.INVALID_TEXT_INPUTS);
            return null;
        } else if (!rawTextInput || rawTextInput.length === 0) {
            setErrorMessage(message.ListManagement.ERROR.EMPTY_INPUT);
            return null;
        }

        return { success: true, validTextInput: validTextInput, invalidTextInput: invalidTextInput };
    };

    // Guard to check if members are in list and handle duplicates.
    const getMembersInList = async () => {
        const validationResult = await handleRawTextInput();

        if (!validationResult || !validationResult.success) {
            return null;
        }

        const { validTextInput } = validationResult;

        //Check if members are in list
        let response;
        switch (list) {
            case 'include':
                response = await getMembersExistInInclude(groupingPath, validTextInput);
                break;
            case 'exclude':
                response = await getMembersExistInExclude(groupingPath, validTextInput);
                break;
            case 'owners':
                response = await getMembersExistInOwners(groupingPath, validTextInput);
                break;
            default:
                console.error(`Unknown list type: ${list}`);
                return null;
        }

        if (!response || !response.members) {
            setErrorMessage('API Error:Failed to retrieve member information');
            return null;
        }

        // Sort those in list and not in list
        const inList = response.members;
        const notInList = Array.from(
            new Map(
                (validTextInput as string[])
                    .filter(
                        (id) =>
                            !inList.some(
                                (member) => member.uhUuid === id || member.uid.toLowerCase() === id.toLowerCase()
                            )
                    )
                    .map((id) => [id, { uid: 'N/A', name: '', uhUuid: id, firstName: '', lastName: '' }])
            ).values()
        );

        // Check if there is any not in list
        if (notInList.length > 0) {
            setErrorMessage(
                `${message.ListManagement.ERROR.CONTAINS_MEMBERS_NOT_IN_LIST} ${notInList.map((member) => member.uhUuid).join(', ')}`
            );
            return null;
        }

        // Duplicates handling showing both uid and uhUuid of a member object.
        const memberInputMap = new Map<string, { member: MemberResult; inputs: string[] }>();
        const duplicateMembers = new Set<string>();

        // Map each input to the member it represents.
        for (const input of validTextInput) {
            const matchingMember = inList.find(
                (member) => member.uhUuid === input || member.uid?.toLowerCase() === input.toLowerCase()
            );

            if (matchingMember) {
                const uhUuid = matchingMember.uhUuid;

                if (!memberInputMap.has(uhUuid)) {
                    memberInputMap.set(uhUuid, { member: matchingMember, inputs: [] });
                }
                memberInputMap.get(uhUuid)!.inputs.push(input);
            }
        }

        // Find members with multiple inputs (duplicates).
        for (const [uhUuid, { inputs }] of memberInputMap.entries()) {
            if (inputs.length > 1) {
                duplicateMembers.add(uhUuid);
            }
        }

        // Condition duplicates error message to display uid, uhUuid, or both based on input
        if (duplicateMembers.size > 0) {
            const duplicateDisplayStrings = Array.from(duplicateMembers).map((uhUuid) => {
                const memberData = memberInputMap.get(uhUuid)!;
                const member = memberData.member;
                const inputs = memberData.inputs;

                const hasUhUuidInput = inputs.some((input) => input === member.uhUuid);
                const hasUidInput = inputs.some((input) => input.toLowerCase() === member.uid.toLowerCase());

                if (hasUhUuidInput && hasUidInput) {
                    return `[${member.uid} = ${member.uhUuid}]`;
                } else if (hasUidInput) {
                    return `[${member.uid}]`;
                } else {
                    return `[${member.uhUuid}]`;
                }
            });

            setErrorMessage(
                `${message.ListManagement.ERROR.DUPLICATE_MEMBERS_INPUT} ${duplicateDisplayStrings.join(', ')}`
            );
            return null;
        }

        return { membersInList: inList };
    };

    // Function to handle loading state and opening the modals.
    const handleLoadingAndOpenModal = async (callback: () => void) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        callback();
        setLoading(false);
    };

    // Handle list management using member search input.
    const handleInputMembers = async (manageType: string) => {
        const result = await getMembersInList();

        if (!result) {
            return;
        }

        const { membersInList } = result;

        if (membersInList.length === 1) {
            await handleLoadingAndOpenModal(() => onOpenManageMemberModal?.(manageType, membersInList));
        } else if (membersInList.length > 1) {
            await handleLoadingAndOpenModal(() => onOpenManageMembersModal?.(manageType, membersInList));
        } else {
            setErrorMessage(message.ListManagement.ERROR.NO_VALID_MEMBERS_TO_REMOVE);
        }
    };

    // Handle List management using the checkbox from the table.
    const handleCheckedMembers = async (manageType: string) => {
        if (checkedMembers.length === 1) {
            await handleLoadingAndOpenModal(() => {
                onOpenManageMemberModal?.(manageType, checkedMembers);
            });
        } else {
            await handleLoadingAndOpenModal(() => onOpenManageMembersModal?.(manageType, checkedMembers));
        }
    };

    const handleRemoveClick = async () => {
        const manageType = 'removeMembers';

        if (manageMembers.trim()) {
            await handleInputMembers(manageType);
        } else if (checkedMembers?.length) {
            await handleCheckedMembers(manageType);
        } else {
            setErrorMessage('Please enter one or more UH members.');
        }
    };

    const handleAddClick = async () => {
        const manageType = 'addMembers';

        if (manageMembers.trim()) {
            await handleInputMembers(manageType);
        } else if (checkedMembers?.length) {
            await handleCheckedMembers(manageType);
        } else {
            setErrorMessage('Please enter one or more UH members.');
        }
    };

    return (
        <div className={`d-lg-flex d-block justify-content-lg-between justify-content-start`}>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className={`col-lg-4 pt-3 pl-0 pr-0 mt-lg-0 my-2`}>
                    <div
                        className={`flex flex-col w-full md:w-[35em] items-start 
                                    sm:flex-row sm:justify-start sm:items-start
                                  `}
                    >
                        <div
                            className={`memSearch relative flex-grow pr-[4px]
                                        ${list === 'owners' ? 'flex-grow-0 w-[300px] flex-shrink-0' : ''}
                                        `}
                        >
                            <Input
                                placeholder="UH Username or UH Number"
                                title="Enter one or more UH members"
                                value={manageMembers}
                                onChange={(e) => setManageMembers(e.target.value)}
                                onFocus={() => setIsMemSearchFocused(true)}
                                onBlur={() => setIsMemSearchFocused(false)}
                                aria-label={`Enter one or more UH members to add to the ${list} list`}
                                className="h-[44px] w-[300px] sm:w-full pr-8"
                            />
                            {manageMembers && isMemSearchFocused && (
                                <button
                                    type="button"
                                    onMouseDown={() => setManageMembers('')}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2"
                                    aria-label="Clear input"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="text-blue-500" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center py-2 sm:py-0 ">
                            <div className="memBtns h-[44px]">
                                <Button
                                    variant="default"
                                    alt="Add Member"
                                    size="default"
                                    aria-label="add-member-button"
                                    data-testid="add-member-button"
                                    onClick={() => {
                                        void handleAddClick();
                                    }}
                                    onBlur={() => {
                                        setLoading(false);
                                        setErrorMessage('');
                                    }}
                                    className="ml-[2px] h-[44px]"
                                >
                                    Add
                                </Button>
                                <Button
                                    variant="removal"
                                    alt="Remove Member"
                                    size="default"
                                    aria-label="remove-member-button"
                                    data-testid="remove-member-button"
                                    onClick={() => {
                                        void handleRemoveClick();
                                    }}
                                    onBlur={() => {
                                        setLoading(false);
                                        setErrorMessage('');
                                    }}
                                    className="ml-[4px] h-[44px]"
                                >
                                    Remove
                                </Button>
                                {list === 'include' || list === 'exclude' ? (
                                    <Button
                                        variant="default"
                                        size="default"
                                        aria-label="Import File"
                                        data-testid="import-file-button"
                                        onClick={() => console.log(`Import file for ${list}`)}
                                        className="ml-[4px] h-[44px]"
                                    >
                                        Import File
                                    </Button>
                                ) : null}
                            </div>
                            <div className="ml-[4px] w-[24px] flex items-center justify-center h-[44px]">
                                {loading || isPerformingRemoval ? (
                                    <Spinner size="sm" show={true} className="text-black stroke-[3.0]" />
                                ) : (
                                    <div style={{ visibility: 'hidden' }}>
                                        <Spinner size="sm" show={false} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {errorMessage && (
                <div
                    className={` ${errorMessage.length > 38 ? 'max-w-[303px] sm:max-w-[532px]' : 'max-w-[303px]'}  top-full left-0
                    bg-red-200 text-red-700 text-base mb-4 py-2 px-4 rounded word-break break-all whitespace-normal`}
                >
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default ListManagement;
