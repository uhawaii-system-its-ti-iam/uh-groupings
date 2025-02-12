'use client';

import React, { useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import DynamicModal from '@/components/modal/dynamic-modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { updateSyncDest } from '@/lib/actions';

const SyncDestinations = ({ syncDestArray, groupingPath }) => {
    const [modalContent, setModalContent] = useState('');
    const [isDynamicModalOpen, setIsDynamicModalOpen] = useState(false);
    const [isSyncDestModalOpen, setIsSyncDestModalOpen] = useState(false);
    const [modalSyncDestContent, setModalSyncDestContent] = useState('');
    const [pendingCheckbox, setPendingCheckbox] = useState(null);
    const [syncDestState, setSyncDestState] = useState(syncDestArray);

    const openDynamicModal = (syncDestDescription) => {
        const syncDest = syncDestArray.find(dest => dest.description === syncDestDescription);
        setModalContent(syncDest?.tooltip || '');
        setIsDynamicModalOpen(true);
    };

    const closeDynamicModal = () => setIsDynamicModalOpen(false);

    const handleSwitchChange = (syncDest) => {
        setPendingCheckbox(syncDest);
        setModalSyncDestContent(syncDest.description);
        setIsSyncDestModalOpen(true);
    };

    const handleConfirmSwitch = async () => {
        if (!pendingCheckbox) return;

        const { syncDestId, synced } = pendingCheckbox;
        const status = !synced;
        const decodedGroupingPath = decodeURIComponent(groupingPath);

        const result = await updateSyncDest(decodedGroupingPath, syncDestId, status);
        if (result.resultCode === "SUCCESS") {
            setSyncDestState(prevState =>
                prevState.map(dest =>
                    dest.syncDestId === syncDestId ? { ...dest, synced: status } : dest
                )
            );
        }
        setIsSyncDestModalOpen(false);
    };

    const handleCloseSwitch = () => setIsSyncDestModalOpen(false);

    return (
        <TooltipProvider>
            <div id="actions-display" className="block">
                <div className="flex flex-wrap">
                    <div className="w-full pr-4 pl-4 relative">
                        <h1 className="font-bold text-3xl text-gray-900 mt-2 ml-0.5">Synchronization Destinations</h1>
                        <p className="text-gray-900 mb-2 w-full mt-5 ml-0.5">
                            Changes made may not take effect immediately. Usually, 3-5 minutes should be anticipated. In extreme cases, a request may take several hours to be fully processed, depending on the number of members and the synchronization destination.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap pt-4 pb-5">
                    <div className="w-full pr-4 pl-4 relative">
                        <h3 className="text-xl text-cyan-800 mt-2 ml-0.5 mb-2">Sync Destinations</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            {syncDestState.map((syncDest, index) => (
                                !syncDest.hidden && (
                                    <div className="flex items-center mb-1 relative" key={index}>
                                        <Switch
                                            className="ml-5 w-9 h-4"
                                            thumbSize="h-3 w-3"
                                            checked={syncDest.synced}
                                            onCheckedChange={() => handleSwitchChange(syncDest)}
                                        />
                                        <label className="text-base text-gray-900 pl-2 mb-0">{syncDest.description}</label>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className="relative ml-2 cursor-pointer"
                                                    onClick={() => openDynamicModal(syncDest.description)}
                                                >
                                                    <MessageCircleQuestion size={20} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent sideOffset={5}>
                                                This option syncs destinations to {syncDest.description}
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
                        title="Synchronization Destination Confirmation"
                        warning="Please be thoughtful about any changes here as some changes are operationally very expensive. Avoid rapidly enabling and disabling a synchronization destination."
                        body={`Are you sure you want to ${pendingCheckbox?.synced ? "disable" : "enable"} the synchronization destination: ${modalSyncDestContent}?`}
                        buttons={[<button key="confirm" onClick={handleConfirmSwitch}> Yes </button>]}
                        onClose={handleCloseSwitch}
                    />
                )}
                <DynamicModal
                    open={isDynamicModalOpen}
                    title="Sync Destinations Information"
                    body={modalContent}
                    cancelText="OK"
                    onClose={closeDynamicModal}
                />
            </div>
        </TooltipProvider>
    );
};

export default SyncDestinations;



