'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DynamicModal from '@/components/modal/dynamic-modal';
import { Switch } from '@/components/ui/switch';
import { updateOptIn, updateOptOut } from '@/lib/actions';

const Preferences = ({ groupingPath }) => {
    const decodedGroupingPath = decodeURIComponent(groupingPath);
    const [allowOptIn, setAllowOptIn] = useState(false);
    const [allowOptOut, setAllowOptOut] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [loading, setLoading] = useState(false);
    const handleOptInChange = async () => {
        setLoading(true);
        const newStatus = !allowOptIn;
        const result = await updateOptIn(decodedGroupingPath, newStatus);
        if (result.resultCode === 'SUCCESS') setAllowOptIn(result.updatedStatus);
        setLoading(false);
    };
    const handleOptOutChange = async () => {
        setLoading(true);
        const newStatus = !allowOptOut;
        const result = await updateOptOut(decodedGroupingPath, newStatus);
        if (result.resultCode === 'SUCCESS') setAllowOptOut(result.updatedStatus);
        setLoading(false);
    };
    const openModal = (content: string) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    return (
        <TooltipProvider>
            <div id="actions-display" className="block">
                <div className="flex flex-wrap">
                    <div className="w-full pr-4 pl-4 relative">
                        <h1 className="font-bold text-3xl text-gray-900 mt-2 ml-0.5">Preferences</h1>
                        <p className="text-gray-900 mb-2 w-full mt-5 ml-0.5">
                            Changes made may not take effect immediately. Usually, 3-5 minutes should be anticipated. In extreme cases, a request may take several hours to be fully processed, depending on the number of members and the synchronization destination.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap pt-4 pb-5">
                    <div className="w-full pr-4 pl-4 relative">
                        <h3 className="text-xl text-cyan-800 mt-2 ml-0.5 mb-2">User Options</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="flex items-center mb-1">
                                <Switch
                                    className="ml-5 w-9 h-4"
                                    thumbSize="h-3 w-3"
                                    checked={allowOptIn}
                                    onCheckedChange={handleOptInChange}
                                    disabled={loading}
                                />
                                <label className="text-base text-gray-900 pl-2 mb-0">
                                    Allow people to add themselves to this group
                                </label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="relative ml-2 cursor-pointer"
                                            onClick={() => openModal('Enable the opt-in self-service so that new members can discover and join this grouping.')}
                                        >
                                            <MessageCircleQuestion size={20} />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={5}>
                                        Enable the opt-in self-service so that new members can discover and join this grouping.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center mb-1">
                                <Switch
                                    className="ml-5 w-9 h-4"
                                    thumbSize="h-3 w-3"
                                    checked={allowOptOut}
                                    onCheckedChange={handleOptOutChange}
                                    disabled={loading}
                                />
                                <label className="text-base text-gray-900 pl-2 mb-0">
                                    Allow people to remove themselves from this group
                                </label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="relative ml-2 cursor-pointer"
                                            onClick={() => openModal('Enable the opt-out self-service so that members can leave at any time.')}
                                        >
                                            <MessageCircleQuestion size={20} />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={5}>
                                        Enable the opt-out self-service so that members can leave at any time.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </form>
                    </div>
                </div>
                {isModalOpen && (
                    <DynamicModal
                        open={isModalOpen}
                        title="Preferences Information"
                        body={modalContent}
                        cancelText="OK"
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </TooltipProvider>
    );
};

export default Preferences;


