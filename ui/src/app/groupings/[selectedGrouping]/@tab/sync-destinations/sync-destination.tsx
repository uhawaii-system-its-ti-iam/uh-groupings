'use client';

import React, { useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { DisplaySyncDestModal, DisplayDynamicModal, ToolTip } from '@/app/groupings/[selectedGrouping]/@tab/UIComponents';

const SyncDestination = ({ syncDestArray }) => {
    const [hovered, setHovered] = useState(null);  // Keep track of the hovered item
    const [isDynamicModalOpen, setIsDynamicModalOpen] = useState(false);  // Modal state for icon
    const [isSyncDestModalOpen, setIsSyncDestModalOpen] = useState(false);  // Modal state for checkbox
    const [modalContent, setModalContent] = useState('');  // Content for DisplayDynamicModal
    const [modalSyncDestContent, setModalSyncDestContent] = useState('');  // Content for DisplaySyncDestModal
    const [pendingCheckbox, setPendingCheckbox] = useState(null);  // Checkbox awaiting confirmation
    const [syncDestState, setSyncDestState] = useState(syncDestArray); // Manage the state of the sync destinations

    // Handle checkbox click and open the modal for confirmation
    const handleCheckboxClick = (syncDest) => {
        setPendingCheckbox(syncDest);  // Track which checkbox is being clicked
        setModalSyncDestContent(syncDest.name);  // Set the content to only the syncDest name
        setIsSyncDestModalOpen(true);  // Open the confirmation modal
    };
    // Handle icon click to open the modal with tooltip data
    const openIconModal = (syncDestName) => {
        const syncDest = syncDestArray.find(dest => dest.name === syncDestName);
        setModalContent(syncDest.tooltip || 'No tooltip available');  // Use tooltip from syncDestArray
        setIsDynamicModalOpen(true);  // Open the modal for the icon
    };

    // Handle confirmation from the checkbox modal
    const handleConfirmCheckbox = () => {
        // Update the checkbox state based on confirmation
        setSyncDestState((prevState) =>
            prevState.map(dest =>
                dest.name === pendingCheckbox.name ? { ...dest, synced: !dest.synced } : dest
            )
        );
        setIsSyncDestModalOpen(false);  // Close the modal
    };

    // Handle modal close without confirming for checkbox
    const handleCloseCheckbox = () => {
        setIsSyncDestModalOpen(false);  // Just close the modal, don't change the checkbox state
    };

    // Handle modal close for the icon modal
    const handleCloseIcon = () => {
        setIsDynamicModalOpen(false);  // Close the icon modal
    };

    return (
        <div id="actions-display" className="block">
            <div className="flex flex-wrap">
                <div className="w-full pr-4 pl-4">
                    <h1 className="font-bold text-3xl text-gray-900 mt-4 ml-0">Synchronization Destinations</h1>
                    <p className="text-gray-900 mb-2 w-full ml-0">
                        Changes made may not take effect immediately. Usually, 3-5 minutes should be anticipated. In extreme cases, a request may take several hours to be fully processed, depending on the number of members and the synchronization destination.
                    </p>
                </div>
            </div>
            <br />
            <div className="flex flex-wrap pt-4 pb-5">
                <div className="md:w-2/3 pr-4 pl-4 -ml-2">
                    <h3 className="text-xl text-cyan-800 mt-0">Sync Destinations</h3>
                    <div>
                        <form onSubmit={(e) => e.preventDefault()}>
                            {syncDestState.map((syncDest, index) => (
                                !syncDest.hidden && ( // Ensure hidden destinations are not rendered
                                    <div className="flex items-center mb-0 relative" key={index}>
                                        <input
                                            type="checkbox"
                                            className="ml-5"
                                            id={`reset-${syncDest.name}-Check`}
                                            onChange={() => handleCheckboxClick(syncDest)}  // Open the checkbox confirmation modal
                                            checked={syncDest.synced}  // Reflect the synced state
                                        />
                                        <label className="text-gray-900 pl-2 mb-0" htmlFor={`reset-${syncDest.name}-Check`}>
                                            {syncDest.name}
                                        </label>
                                        {/* MessageCircleQuestion icon */}
                                        <div
                                            className="relative ml-2 cursor-pointer"
                                            onMouseEnter={() => setHovered(syncDest.name)}
                                            onMouseLeave={() => setHovered(null)}
                                            onClick={() => openIconModal(syncDest.name)}  // Open the icon modal on click
                                        >
                                            <MessageCircleQuestion size={20} />
                                            {/* Show Tooltip on Hover using the description */}
                                            {hovered === syncDest.name && (
                                                <ToolTip message={`This option sync destinations to ${syncDest.name}`} />
                                            )}
                                        </div>
                                    </div>
                                )
                            ))}
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal Component for Confirming Checkbox Action */}
            {isSyncDestModalOpen && (
                <DisplaySyncDestModal
                    title="Synchronization Destination Confirmation"
                    syncType={modalSyncDestContent}  // The sync destination name with action
                    onConfirm={handleConfirmCheckbox}  // Confirm action
                    onClose={handleCloseCheckbox}  // Close without action
                />
            )}

            {/* Modal Component for Icon Info */}
            {isDynamicModalOpen && (
                <DisplayDynamicModal
                    title="Sync Destinations Information"
                    message={modalContent}
                    onClose={handleCloseIcon}  // Close the modal for the icon
                />
            )}
        </div>
    );
};

export default SyncDestination;



