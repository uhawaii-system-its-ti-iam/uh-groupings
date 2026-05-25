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
import type { GroupingSyncDestination } from '@/lib/types';

interface SyncDestinationsProps {
    /** All sync destinations for the grouping. Items where `hidden` is true are not rendered. */
    syncDestArray: GroupingSyncDestination[];
    /** URL-encoded grouping path; decoded internally before being sent to the actions layer. */
    groupingPath: string;
}

/**
 * Renders the Synchronization Destinations pane: a toggle per non-hidden
 * destination plus an info icon that opens a help modal with the destination's
 * tooltip text.
 *
 * Toggle flow:
 *   1. User clicks a switch and a confirmation modal opens describing the change.
 *   2. "Yes" calls `updateSyncDest(decodedPath, name, !synced)`.
 *   3. On `{ resultCode: 'SUCCESS' }` the local switch state is flipped and the
 *      router is refreshed to revalidate any server-rendered data downstream.
 *
 * Testing hooks (do not remove without updating the test suite):
 *   - `data-testid="sync-destinations-form"`     — for the form-submit preventDefault test.
 *   - `data-testid="info-icon-<destinationName>"`— per-row info icon button.
 */
const SyncDestinations = ({ syncDestArray, groupingPath }: SyncDestinationsProps) => {
    const router = useRouter();
    const [modalContent, setModalContent] = useState('');
    const [isDynamicModalOpen, setIsDynamicModalOpen] = useState(false);
    const [isSyncDestModalOpen, setIsSyncDestModalOpen] = useState(false);
    const [modalSyncDestContent, setModalSyncDestContent] = useState('');
    const [pendingSyncDest, setPendingSyncDest] = useState<GroupingSyncDestination | null>(null);
    const [syncDestList, setSyncDestList] = useState<GroupingSyncDestination[]>(syncDestArray);

    const openDynamicModal = (syncDestDescription: string) => {
        const syncDest = syncDestArray.find(dest => dest.description === syncDestDescription);
        setModalContent(syncDest?.tooltip || '');
        setIsDynamicModalOpen(true);
    };

    const closeDynamicModal = () => setIsDynamicModalOpen(false);

    const openSyncDestConfirmModal = (syncDest: GroupingSyncDestination) => {
        setPendingSyncDest(syncDest);
        setModalSyncDestContent(syncDest.description);
        setIsSyncDestModalOpen(true);
    };

    const confirmSyncDestChange = async () => {
        if (!pendingSyncDest) return;
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
                        <form onSubmit={(e) => e.preventDefault()} data-testid="sync-destinations-form">
                            {syncDestList.map((syncDest) => (
                                !syncDest.hidden && (
                                    <div className='flex items-center mb-1 relative' key={syncDest.name}>
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
                            pendingSyncDest?.synced ?? false,
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
                        closeText={message.Preferences.MODAL_CANCEL}
                        onClose={closeSyncDestModal}
                    />
                )}

                <DynamicModal
                    open={isDynamicModalOpen}
                    title={message.SyncDestinations.MODAL_INFO_TITLE}
                    body={modalContent}
                    buttons={[<span key="stay" onClick={closeDynamicModal}>{message.Preferences.MODAL_CLOSE}</span>]}
                    onClose={closeDynamicModal}
                />
            </div>
        </TooltipProvider>
    );
};

export default SyncDestinations;
