'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DynamicModal from '@/components/modal/dynamic-modal';
import { Spinner } from '@/components/ui/spinner';
import { message } from '@/lib/messages';
import {
    resetIncludeGroup,
    resetIncludeGroupAsync,
    resetExcludeGroup,
    resetExcludeGroupAsync
} from '@/lib/actions';

const Actions = ({ groupingPath }: { groupingPath: string }) => {
    const router = useRouter();
    const decodedGroupingPath = decodeURIComponent(groupingPath);
    const groupName = decodedGroupingPath.split(':').pop() as string;

    const [isIncludeChecked, setIsIncludeChecked] = useState(false);
    const [isExcludeChecked, setIsExcludeChecked] = useState(false);
    const [isIncludeDisabled, setIsIncludeDisabled] = useState(false);
    const [isExcludeDisabled, setIsExcludeDisabled] = useState(false);
    const [isResetGroupModalOpen, setIsResetGroupModalOpen] = useState(false);
    const [isDynamicModalOpen, setIsDynamicModalOpen] = useState(false);
    const [dynamicModalContent, setDynamicModalContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const toggleIncludeCheck = () => {
        setIsIncludeChecked(prev => !prev);
    };

    const toggleExcludeCheck = () => {
        setIsExcludeChecked(prev => !prev);
    };

    const openDynamicModal = (content: string) => {
        setDynamicModalContent(content);
        setIsDynamicModalOpen(true);
    };

    const closeDynamicModal = () => {
        setIsDynamicModalOpen(false);
    };

    const openResetGroupModal = () => {
        setIsResetGroupModalOpen(true);
    };

    const closeResetGroupModal = () => {
        setIsResetGroupModalOpen(false);
    };

    const handleResetConfirm = async () => {
        setIsLoading(true);
        closeResetGroupModal();
        await new Promise(resolve => setTimeout(resolve, 0));
        const requests: Promise<string>[] = [];
        const successMessages: string[] = [];

        if (isIncludeChecked) {
            setIsIncludeDisabled(true);
            requests.push(
                (
                    decodedGroupingPath.length <= 750
                        ? resetIncludeGroup(decodedGroupingPath)
                        : resetIncludeGroupAsync(decodedGroupingPath)
                ).then(result => {
                    if (result.resultCode === 'SUCCESS') {
                        setIsIncludeChecked(false);
                        successMessages.push('The Include list has successfully been reset.');
                    }
                    setIsIncludeDisabled(false);
                })
            );
        }

        if (isExcludeChecked) {
            setIsExcludeDisabled(true);
            requests.push(
                (
                    decodedGroupingPath.length <= 750
                        ? resetExcludeGroup(decodedGroupingPath)
                        : resetExcludeGroupAsync(decodedGroupingPath)
                ).then(result => {
                    if (result.resultCode === 'SUCCESS') {
                        setIsExcludeChecked(false);
                        successMessages.push('The Exclude list has successfully been reset.');
                    }
                    setIsExcludeDisabled(false);
                })
            );
        }

        await Promise.all(requests);
        setIsLoading(false);
        if (successMessages.length > 0) {
            setSuccessMessage(successMessages.join(' '));
            setIsSuccessModalOpen(true);
            router.refresh();
        }
    };

    return (
        <TooltipProvider>
            <div id='actions-display' className='block relative'>
                <div className='flex flex-wrap'>
                    <div className='w-full pr-4 pl-4 relative'>
                        <h1 className='font-bold text-3xl text-gray-900 mt-2 ml-0.5'>
                            {message.Actions.TITLE}
                        </h1>
                        <p className='text-gray-900 mb-2 w-full mt-5 ml-0.5'>
                            {message.Preferences.INFO}
                        </p>
                    </div>
                </div>

                <div className='flex flex-wrap pt-4 pb-5'>
                    <div className='w-full pr-4 pl-4 relative'>
                        <h3 className='text-xl text-cyan-800 mt-2 ml-0.5 mb-2'>
                            {message.Actions.SECTION_TITLE}
                        </h3>
                        <form onSubmit={e => e.preventDefault()}>
                            <div className='flex items-center mb-1 relative'>
                                <input
                                    type='checkbox'
                                    id='include-check'
                                    checked={isIncludeChecked}
                                    onChange={toggleIncludeCheck}
                                    disabled={isIncludeDisabled || isLoading}
                                    className='ml-5 h-4 w-4 text-cyan-600 border-gray-300 rounded'
                                />
                                <label
                                    htmlFor='include-check'
                                    className='text-base text-gray-900 pl-2 mb-0'
                                >
                                    {message.Actions.INCLUDE_LABEL}
                                </label>
                            </div>

                            <div className='flex items-center mb-1 relative'>
                                <input
                                    type='checkbox'
                                    id='exclude-check'
                                    checked={isExcludeChecked}
                                    onChange={toggleExcludeCheck}
                                    disabled={isExcludeDisabled || isLoading}
                                    className='ml-5 h-4 w-4 text-cyan-600 border-gray-300 rounded'
                                />
                                <label
                                    htmlFor='exclude-check'
                                    className='text-base text-gray-900 pl-2 mb-0'
                                >
                                    {message.Actions.EXCLUDE_LABEL}
                                </label>
                            </div>

                            <div className='flex items-center space-x-2'>
                                <button
                                    className='bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-2 rounded text-xs'
                                    type='button'
                                    disabled={(!isIncludeChecked && !isExcludeChecked) || isLoading}
                                    onClick={openResetGroupModal}
                                >
                                    {message.Actions.RESET_BUTTON}
                                </button>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className='relative ml-2 cursor-pointer'
                                            onClick={() => openDynamicModal(message.Actions.TOOLTIP)}
                                            data-testid="actions-tooltip-icon"
                                        >
                                            <span className="text-green-blue">
                                                <FontAwesomeIcon icon={faCircleQuestion} />
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={5}>
                                        {message.Actions.TOOLTIP}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </form>
                    </div>
                </div>

                {isResetGroupModalOpen && (
                    <DynamicModal
                        open={isResetGroupModalOpen}
                        title={message.Actions.MODAL_TITLE}
                        body={message.Actions.MODAL_BODY(isIncludeChecked, isExcludeChecked, groupName)}
                        buttons={[
                            <span key='confirm' role='button' onClick={handleResetConfirm}>
                                {message.Actions.MODAL_CONFIRM}
                            </span>
                        ]}
                        closeText={message.Preferences.MODAL_CANCEL}
                        onClose={closeResetGroupModal}
                    />
                )}

                {isLoading && (
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
                        title={message.Actions.MODAL_INFO_TITLE}
                        body={dynamicModalContent}
                        buttons={[<span key="stay" onClick={close}>OK</span>]}
                        onClose={closeDynamicModal}
                    />
                )}

                {isSuccessModalOpen && (
                    <DynamicModal
                        open={isSuccessModalOpen}
                        title={message.Actions.MODAL_SUCCESS_TITLE}
                        body={successMessage}
                        closeText={message.Preferences.MODAL_CLOSE}
                        onClose={() => setIsSuccessModalOpen(false)}
                    />
                )}
            </div>
        </TooltipProvider>
    );
};

export default Actions;
