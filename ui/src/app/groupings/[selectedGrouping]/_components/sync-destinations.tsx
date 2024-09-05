'use client';

import React, { useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { DisplayDynamicModal, DisplaySyncDestModal, ToolTip } from './UIComponents';

const SyncDestinations = ({ syncDestinations = [] }) => { // Default to empty array if undefined
                                                          // State for modal and checkbox management
    const [syncDestArray, setSyncDestArray] = useState(syncDestinations); // Initialize state with fetched data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [syncType, setSyncType] = useState('');
    const [pendingCheckbox, setPendingCheckbox] = useState(null);
    const [hovered, setHovered] = useState(null);

    // Handle checkbox click
    const handleCheckboxClick = (syncDestName) => {
        setPendingCheckbox(syncDestName);
        setSyncType(syncDestName);
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmation = (confirmed) => {
        if (confirmed && pendingCheckbox) {
            setSyncDestArray((prevArray) =>
                prevArray.map((item) =>
                    item.name === pendingCheckbox ? { ...item, synced: !item.synced } : item
                )
            );
        }
        setPendingCheckbox(null);
        setIsConfirmationModalOpen(false);
    };

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const clickWithEnter = (event, syncDestName) => {
        if (event.keyCode === 13) {
            handleCheckboxClick(syncDestName);
        }
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
                            {syncDestArray.map((syncDest, index) => (
                                !syncDest.hidden && ( // Ensure hidden destinations are not rendered
                                    <div className="flex items-center mb-0" key={index}>
                                        <input
                                            type="checkbox"
                                            className="ml-5"
                                            id={`reset-${syncDest.name}-Check`}
                                            onChange={() => handleCheckboxClick(syncDest.name)}
                                            checked={syncDest.synced}
                                            onKeyDown={(event) => clickWithEnter(event, syncDest.name)}
                                        />
                                        <label className="text-gray-900 pl-2 mb-0" htmlFor={`reset-${syncDest.name}-Check`}>
                                            {syncDest.description}
                                        </label>
                                        <div
                                            className="relative ml-2"
                                            onMouseEnter={() => setHovered(syncDest.name)}
                                            onMouseLeave={() => setHovered(null)}
                                            onClick={() => openModal(syncDest.tooltip)}
                                        >
                                            <MessageCircleQuestion className="w-6 h-6 cursor-pointer" />
                                            {hovered === syncDest.name && (
                                                <ToolTip message={syncDest.tooltip} />
                                            )}
                                        </div>
                                    </div>
                                )
                            ))}
                        </form>
                    </div>
                </div>
            </div>

            {/* Icon-related Modal */}
            {isModalOpen && (
                <DisplayDynamicModal
                    title="Sync Destinations Information"
                    message={modalContent}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {/* Confirmation Modal with Warning */}
            {isConfirmationModalOpen && (
                <DisplaySyncDestModal
                    title="Synchronization Destination Confirmation"
                    onClose={() => handleConfirmation(false)}
                    onConfirm={() => handleConfirmation(true)}
                    syncType={syncType}
                />
            )}
        </div>
    );
};

export default SyncDestinations;
