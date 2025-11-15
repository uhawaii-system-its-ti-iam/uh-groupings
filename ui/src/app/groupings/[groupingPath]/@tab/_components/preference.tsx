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
import { updateOptIn, updateOptOut } from '@/lib/actions';

const Preferences = ({
                         groupingPath,
                         allowOptIn,
                         allowOptOut,
                     }: {
    groupingPath: string;
    allowOptIn: boolean;
    allowOptOut: boolean;
}) => {
    const router = useRouter();
    const decodedGroupingPath = decodeURIComponent(groupingPath);
    const [isOptInEnabled, setIsOptInEnabled] = useState(allowOptIn);
    const [isOptOutEnabled, setIsOptOutEnabled] = useState(allowOptOut);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleOptInChange = async () => {
        setIsLoading(true);
        const newStatus = !isOptInEnabled;
        const result = await updateOptIn(decodedGroupingPath, newStatus);
        if (result.resultCode === 'SUCCESS') {
            setIsOptInEnabled(result.updatedStatus);
            router.refresh();
        }
        setIsLoading(false);
    };

    const handleOptOutChange = async () => {
        setIsLoading(true);
        const newStatus = !isOptOutEnabled;
        const result = await updateOptOut(decodedGroupingPath, newStatus);
        if (result.resultCode === 'SUCCESS') {
            setIsOptOutEnabled(result.updatedStatus);
            router.refresh();
        }
        setIsLoading(false);
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
                        <h1 className="font-bold text-3xl text-gray-900 mt-2 ml-0.5">
                            {message.Preferences.TITLE}
                        </h1>
                        <p className="text-gray-900 mb-2 w-full mt-5 ml-0.5">
                            {message.Preferences.INFO}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap pt-4 pb-5">
                    <div className="w-full pr-4 pl-4 relative">
                        <h3 className="text-xl text-cyan-800 mt-2 ml-0.5 mb-2">
                            {message.Preferences.SECTION_TITLE}
                        </h3>
                        <form onSubmit={(e) => e.preventDefault()} data-testid="preferences-form">
                            <div className="flex items-center mb-1">
                                <Switch
                                    id="opt-in-switch"
                                    aria-labelledby="opt-in-label"
                                    className="ml-5 w-9 h-4"
                                    thumbClassName="h-3 w-3"
                                    checked={isOptInEnabled}
                                    onCheckedChange={handleOptInChange}
                                    disabled={isLoading}
                                />
                                <label
                                    id="opt-in-label"
                                    htmlFor="opt-in-switch"
                                    className="text-base text-gray-900 pl-2 mb-0"
                                >
                                    {message.Preferences.OPT_IN_LABEL}
                                </label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="relative ml-2 cursor-pointer"
                                            onClick={() => openModal(message.Tooltip.OPT_IN)}
                                        >
                                            <span className="text-green-blue">
                                                <FontAwesomeIcon icon={faCircleQuestion} />
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={5}>
                                        {message.Tooltip.OPT_IN}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center mb-1">
                                <Switch
                                    id="opt-out-switch"
                                    aria-labelledby="opt-out-label"
                                    className="ml-5 w-9 h-4"
                                    thumbClassName="h-3 w-3"
                                    checked={isOptOutEnabled}
                                    onCheckedChange={handleOptOutChange}
                                    disabled={isLoading}
                                />
                                <label
                                    id="opt-out-label"
                                    htmlFor="opt-out-switch"
                                    className="text-base text-gray-900 pl-2 mb-0"
                                >
                                    {message.Preferences.OPT_OUT_LABEL}
                                </label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="relative ml-2 cursor-pointer"
                                            onClick={() => openModal(message.Tooltip.OPT_OUT)}
                                        >
                                            <span className="text-green-blue">
                                                <FontAwesomeIcon icon={faCircleQuestion} />
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={5}>
                                        {message.Tooltip.OPT_OUT}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </form>
                    </div>
                </div>
                {isModalOpen && (
                    <DynamicModal
                        open={isModalOpen}
                        title={message.Preferences.MODAL_TITLE}
                        body={modalContent}
                        closeText={message.Preferences.MODAL_CLOSE}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </TooltipProvider>
    );
};

export default Preferences;
