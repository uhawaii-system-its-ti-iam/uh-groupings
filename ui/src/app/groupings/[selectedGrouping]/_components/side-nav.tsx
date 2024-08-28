'use client';

import { useRouter } from 'next/navigation';
import { Users, CreditCard, UserPlus, UserMinus, Crown, Share2, Settings, Wrench } from 'lucide-react';
import { useState } from 'react';

const SideNav = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
    const router = useRouter();

    const navigateTo = (tab: string) => {
        setActiveTab(tab);
        router.push(`/uhgroupings/groupings/Path/${tab}`);
    };

    return (
        <ul className="flex md:flex-col sm:flex-row md:justify-start justify-center">
            <li className="px-0 mt-1 mx-auto pt-0" data-tip="All Members" data-place="right">
                <a
                    className="py-2 px-4 items-center justify-center"
                    aria-label="All Members"
                    onClick={() => navigateTo('all')}
                >
                    <Users aria-hidden="true" />
                </a>
            </li>
            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Basis Members" data-place="right">
                <a
                    className="py-2 px-4 items-center justify-center"
                    aria-label="Basis Members"
                    onClick={() => navigateTo('basis')}
                >
                    <CreditCard aria-hidden="true" />
                </a>
            </li>
            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Include Members" data-place="right">
                <a
                    className="py-2 px-4 items-center justify-center"
                    aria-label="Include Members"
                    onClick={() => navigateTo('include')}
                >
                    <UserPlus aria-hidden="true" />
                </a>
            </li>
            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Exclude Members" data-place="right">
                <a
                    className="py-2 px-4 items-center justify-center"
                    aria-label="Exclude Members"
                    onClick={() => navigateTo('exclude')}
                >
                    <UserMinus aria-hidden="true" />
                </a>
            </li>
            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Grouping Owners" data-place="right">
                <a
                    className="py-2 px-4 items-center justify-center"
                    aria-label="Grouping Owners"
                    onClick={() => navigateTo('owners')}
                >
                    <Crown aria-hidden="true" />
                </a>
            </li>
            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Sync Destinations" data-place="right">
                <a
                    className="py-2 px-4 items-center justify-center"
                    aria-label="Sync Destinations"
                    onClick={() => navigateTo('sync-destinations')}
                >
                    <Share2 aria-hidden="true" />
                </a>
            </li>
            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Preferences" data-place="right">
                <a
                    className="py-2 px-4 items-center justify-center"
                    aria-label="Preferences"
                    onClick={() => navigateTo('preferences')}
                >
                    <Settings aria-hidden="true" />
                </a>
            </li>
            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Actions" data-place="right">
                <a
                    className="py-2 px-4 items-center justify-center"
                    aria-label="Actions"
                    onClick={() => navigateTo('actions')}
                >
                    <Wrench aria-hidden="true" />
                </a>
            </li>
        </ul>
    );
};

export default SideNav;
