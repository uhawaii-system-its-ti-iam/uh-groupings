'use client';

import React, { useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DynamicModal from '@/components/modal/dynamic-modal';
import { Spinner } from '@/components/ui/spinner';
import {
    resetIncludeGroup,
    resetIncludeGroupAsync,
    resetExcludeGroup,
    resetExcludeGroupAsync
} from '@/lib/actions';

const Actions = ({ groupingPath }: { groupingPath: string }) => {
    const decodedGroupingPath = decodeURIComponent(groupingPath);
    const groupName = decodedGroupingPath.split(':').pop() as string;
    const [includeCheck, setIncludeCheck] = useState(false);
    const [excludeCheck, setExcludeCheck] = useState(false);
    const [includeDisable, setIncludeDisable] = useState(false);
    const [excludeDisable, setExcludeDisable] = useState(false);
    const [isResetGroupModalOpen, setIsResetGroupModalOpen] = useState(false);
    const [isDynamicModalOpen, setIsDynamicModalOpen] = useState(false);
    const [dynamicModalContent, setDynamicModalContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    function toggleIncludeCheck() {
        setIncludeCheck(prev => !prev);
    }

    function toggleExcludeCheck() {
        setExcludeCheck(prev => !prev);
    }

    function openDynamicModal(content: string) {
        setDynamicModalContent(content);
        setIsDynamicModalOpen(true);
    }

    function closeDynamicModal() {
        setIsDynamicModalOpen(false);
    }

    function openResetGroupModal() {
        setIsResetGroupModalOpen(true);
    }

    function closeResetGroupModal() {
        setIsResetGroupModalOpen(false);
    }

    async function handleResetConfirm() {
        setLoading(true);
        closeResetGroupModal();
        await new Promise(resolve => setTimeout(resolve, 0));
        const requests: Promise<string>[] = [];
        const successMessages: string[] = [];

        if (includeCheck) {
            setIncludeDisable(true);
            requests.push(
                (
                    decodedGroupingPath.length <= 750
                        ? resetIncludeGroup(decodedGroupingPath)
                        : resetIncludeGroupAsync(decodedGroupingPath)
                ).then(result => {
                    if (result.resultCode === 'SUCCESS') {
                        setIncludeCheck(false);
                        successMessages.push(
                            'The Include list has successfully been reset.'
                        );
                    }
                    setIncludeDisable(false);
                })
            );
        }

        if (excludeCheck) {
            setExcludeDisable(true);
            requests.push(
                (
                    decodedGroupingPath.length <= 750
                        ? resetExcludeGroup(decodedGroupingPath)
                        : resetExcludeGroupAsync(decodedGroupingPath)
                ).then(result => {
                    if (result.resultCode === 'SUCCESS') {
                        setExcludeCheck(false);
                        successMessages.push(
                            'The Exclude list has successfully been reset.'
                        );
                    }
                    setExcludeDisable(false);
                })
            );
        }

        await Promise.all(requests);
        setLoading(false);
        if (successMessages.length > 0) {
            setSuccessMessage(successMessages.join(' '));
            setIsSuccessModalOpen(true);
        }
    }

    return (
        <TooltipProvider>
            <div id='actions-display' className='block relative'>
                <div className='flex flex-wrap'>
                    <div className='w-full pr-4 pl-4 relative'>
                        <h1 className='font-bold text-3xl text-gray-900 mt-2 ml-0.5'>
                            Grouping Actions
                        </h1>
                        <p className='text-gray-900 mb-2 w-full mt-5 ml-0.5'>
                            Changes made may not take effect immediately. Usually, 3-5 minutes
                            should be anticipated. In extreme cases, a request may take several
                            hours to be fully processed, depending on the number of members and the
                            synchronization destination.
                        </p>
                    </div>
                </div>

                <div className='flex flex-wrap pt-4 pb-5'>
                    <div className='w-full pr-4 pl-4 relative'>
                        <h3 className='text-xl text-cyan-800 mt-2 ml-0.5 mb-2'>Reset Grouping</h3>
                        <form onSubmit={e => e.preventDefault()}>
                            <div className='flex items-center mb-1 relative'>
                                <input
                                    type='checkbox'
                                    id='include-check'
                                    checked={includeCheck}
                                    onChange={toggleIncludeCheck}
                                    disabled={includeDisable || loading}
                                    className='ml-5 h-4 w-4 text-cyan-600 border-gray-300 rounded'
                                />
                                <label
                                    htmlFor='include-check'
                                    className='text-base text-gray-900 pl-2 mb-0'
                                >
                                    Reset Include
                                </label>
                            </div>

                            <div className='flex items-center mb-1 relative'>
                                <input
                                    type='checkbox'
                                    id='exclude-check'
                                    checked={excludeCheck}
                                    onChange={toggleExcludeCheck}
                                    disabled={excludeDisable || loading}
                                    className='ml-5 h-4 w-4 text-cyan-600 border-gray-300 rounded'
                                />
                                <label
                                    htmlFor='exclude-check'
                                    className='text-base text-gray-900 pl-2 mb-0'
                                >
                                    Reset Exclude
                                </label>
                            </div>

                            <div className='flex items-center space-x-2'>
                                <button
                                    className='bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-2 rounded text-xs'
                                    type='button'
                                    disabled={(!includeCheck && !excludeCheck) || loading}
                                    onClick={openResetGroupModal}
                                >
                                    Reset Selected
                                </button>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className='relative ml-2 cursor-pointer'
                                            onClick={() =>
                                                openDynamicModal(
                                                    'Reset the grouping by removing all of the members in the include or exclude or both.'
                                                )
                                            }
                                        >
                                            <MessageCircleQuestion className='w-6 h-6' />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={5}>
                                        Reset the grouping by removing all of the members in the
                                        include or exclude or both.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </form>
                    </div>
                </div>

                {isResetGroupModalOpen && (
                    <DynamicModal
                        open={isResetGroupModalOpen}
                        title='Reset Grouping'
                        body={`Are you sure you want to remove all members from the ${
                            includeCheck && excludeCheck
                                ? 'Exclude and Include lists'
                                : includeCheck
                                    ? 'Include list'
                                    : 'Exclude list'
                        } in the ${groupName} grouping?`}
                        buttons={[
                            <span key='confirm' role='button' onClick={handleResetConfirm}>
                                Yes
                            </span>
                        ]}
                        onClose={closeResetGroupModal}
                    />
                )}

                {loading && (
                    <div
                        role='status'
                        aria-live='assertive'
                        aria-busy='true'
                        aria-label='Loading spinner'
                        id='loading-spinner'
                        data-testid='loading-spinner'
                        className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
                    >
                        <Spinner size='lg' data-testid='spinner' role='presentation' />
                    </div>
                )}

                {isDynamicModalOpen && (
                    <DynamicModal
                        open={isDynamicModalOpen}
                        title='Actions Information'
                        body={dynamicModalContent}
                        cancelText='OK'
                        onClose={closeDynamicModal}
                    />
                )}

                {isSuccessModalOpen && (
                    <DynamicModal
                        open={isSuccessModalOpen}
                        title='Grouping Reset Completion'
                        body={successMessage}
                        cancelText='OK'
                        onClose={() => setIsSuccessModalOpen(false)}
                    />
                )}
            </div>
        </TooltipProvider>
    );
};

export default Actions;
