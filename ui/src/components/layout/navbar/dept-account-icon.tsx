'use client';

import { useState } from 'react';

import { School } from 'lucide-react';
import DynamicModal from '@/components/modal/dynamic-modal';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import User from '@/lib/access/user';
import Role from '@/lib/access/role';

const DeptAccountIcon = ({ currentUser }: { currentUser: User }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openDepartmentalModal = () => {
        setIsModalOpen(true);
    };

    const closeDepartmentalModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {currentUser.roles.includes(Role.DEPARTMENTAL) && (
                <div
                    onClick={openDepartmentalModal}
                    className="flex justify-center items-center rounded-full
                            h-[45px] w-[45px] bg-seafoam mx-auto relative lg:ml-24"
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <FontAwesomeIcon aria-label="user" icon={faUser} width={14} height={16} />
                                <div
                                    className="bg-blue-background rounded-full flex justify-center
                                    items-center h-[20px] w-[25px] absolute left-7 bottom-0"
                                >
                                    <School
                                        className="fill-white stroke-1 p-0.5"
                                        aria-label="Departmental Account Icon"
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>You are not in your personal account</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}
            {isModalOpen && (
                <DynamicModal
                    open={isModalOpen}
                    title={'Warning'}
                    body={'You are not in your personal account.'}
                    buttons={[]}
                    onClose={closeDepartmentalModal}
                />
            )}
        </>
    );
};

export default DeptAccountIcon;
