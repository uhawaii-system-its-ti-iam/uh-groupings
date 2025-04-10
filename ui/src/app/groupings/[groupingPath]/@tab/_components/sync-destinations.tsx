'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import DynamicModal from '@/components/modal/dynamic-modal';
import { message } from '@/lib/messages';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { updateSyncDest } from '@/lib/actions';

const SyncDestinations = ({ syncDestArray, groupingPath }) => {
    const router = useRouter();
    const [modalContent, setModalContent] = useState('');
    const [isDynamicModalOpen, setIsDynamicModalOpen] = useState(false);
    const [isSyncDestModalOpen, setIsSyncDestModalOpen] = useState(false);
    const [modalSyncDestContent, setModalSyncDestContent] = useState('');
    const [pendingSyncDest, setPendingSyncDest] = useState(null);
    const [syncDestList, setSyncDestList] = useState(syncDestArray);

    const openDynamicModal = (syncDestDescription) => {
        const syncDest = syncDestArray.find(dest => dest.description === syncDestDescription);
        setModalContent(syncDest?.tooltip || '');
        setIsDynamicModalOpen(true);
    };

    const closeDynamicModal = () => setIsDynamicModalOpen(false);

    const openSyncDestConfirmModal = (syncDest) => {
        setPendingSyncDest(syncDest);
        setModalSyncDestContent(syncDest.description);
        setIsSyncDestModalOpen(true);
    };

    const confirmSyncDestChange = async () => {
        const { name, synced } = pendingSyncDest;
        const status = !synced;
        const decodedGroupingPath = decodeURIComponent(groupingPath);

        const result = await updateSyncDest(decodedGroupingPath, name, status);
        if (result.resultCode === 'SUCCESS') {
            setSyncDestList(prevList =>
                prevList.map(dest =>
                    dest.name === name ? { ...dest, synced: status } : dest
                )
            );
            router.refresh();
        }
        setIsSyncDestModalOpen(false);
    };

    const closeSyncDestModal = () => setIsSyncDestModalOpen(false);

    return (
        <TooltipProvider>
            <div id='actions-display' className='block'>
                <div className='flex flex-wrap'>
                    <div className='w-full pr-4 pl-4 relative'>
                        <h1 className='font-bold text-3xl text-gray-900 mt-2 ml-0.5'>
                            {message.SyncDestinations.TITLE}
                        </h1>
                        <p className='text-gray-900 mb-2 w-full mt-5 ml-0.5'>
                            {message.Preferences.INFO}
                        </p>
                    </div>
                </div>

                <div className='flex flex-wrap pt-4 pb-5'>
                    <div className='w-full pr-4 pl-4 relative'>
                        <h3 className='text-xl text-cyan-800 mt-2 ml-0.5 mb-2'>
                            {message.SyncDestinations.SECTION_TITLE}
                        </h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            {syncDestList.map((syncDest, index) => (
                                !syncDest.hidden && (
                                    <div className='flex items-center mb-1 relative' key={index}>
                                        <Switch
                                            className='ml-5 w-9 h-4'
                                            thumbClassName='h-3 w-3'
                                            checked={syncDest.synced}
                                            onCheckedChange={() => openSyncDestConfirmModal(syncDest)}
                                            aria-labelledby={`label-${syncDest.name}`}
                                        />
                                        <label
                                            id={`label-${syncDest.name}`}
                                            className='text-base text-gray-900 pl-2 mb-0'
                                        >
                                            {syncDest.description}
                                        </label>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    data-testid={`info-icon-${syncDest.name}`}
                                                    className='relative ml-2 cursor-pointer'
                                                    onClick={() => openDynamicModal(syncDest.description)}
                                                >
                                                    <span className="text-green-blue">
                                                        <FontAwesomeIcon icon={faCircleQuestion} />
                                                    </span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent sideOffset={5}>
                                                {message.Tooltip.SYNC_DEST(syncDest.description)}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                )
                            ))}
                        </form>
                    </div>
                </div>

                {isSyncDestModalOpen && (
                    <DynamicModal
                        open={isSyncDestModalOpen}
                        title={message.SyncDestinations.MODAL_TITLE}
                        warning={message.SyncDestinations.MODAL_WARNING}
                        body={message.SyncDestinations.MODAL_BODY(
                            pendingSyncDest?.synced,
                            modalSyncDestContent
                        )}
                        buttons={[
                            <button
                                key='confirm'
                                onClick={confirmSyncDestChange}
                            >
                                {message.SyncDestinations.MODAL_CONFIRM}
                            </button>
                        ]}
                        onClose={closeSyncDestModal}
                    />
                )}

                <DynamicModal
                    open={isDynamicModalOpen}
                    title={message.SyncDestinations.MODAL_INFO_TITLE}
                    body={modalContent}
                    cancelText={message.Preferences.MODAL_CLOSE}
                    onClose={closeDynamicModal}
                />
            </div>
        </TooltipProvider>
    );
};

export default SyncDestinations;
