'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faUserPlus,
    faUserMinus,
    faCrown,
    faShareAlt,
    faCog,
    faTools
} from '@fortawesome/free-solid-svg-icons';
import { faIdCard } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SideNav = ({ groupingPath }: { groupingPath: string }) => {
    const currentPath = usePathname().split('/').pop();

    const links = [
        { href: 'all-members', icon: faUsers, label: 'List all members (Basis + Include - Exclude members)' },
        { href: 'basis', icon: faIdCard, label: 'List only Basis members' },
        { href: 'include', icon: faUserPlus, label: 'Manage the Include members list' },
        { href: 'exclude', icon: faUserMinus, label: 'Manage the Exclude members list' },
        { href: 'owners', icon: faCrown, label: 'Manage this grouping\'s owners' },
        { href: 'sync-destinations', icon: faShareAlt, label: 'Manage this grouping\'s sync destinations' },
        { href: 'preferences', icon: faCog, label: 'Manage this grouping\'s preferences' },
        { href: 'actions', icon: faTools, label: 'Tools to perform actions on this grouping\n' }
    ];

    return (
        <div className="flex-shrink-0 sm:w-full md:w-1/6 lg:w-1/12 bg-teal-tint py-4 px-3.5">
            <ul className="flex md:flex-col sm:flex-row md:justify-start justify-center">
                {links.map(({ href, icon, label }) => {
                    const isSelected = currentPath === href;

                    return (
                        <li key={href} className="mt-1 mx-auto">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link
                                            href={`/groupings/${decodeURIComponent(groupingPath)}/${href}`}
                                            className={`flex items-center justify-center w-11 h-11 rounded-full 
                                            border-none ${isSelected ? 'bg-white' : 'bg-transparent'}`}
                                        >
                                            <FontAwesomeIcon
                                                aria-hidden="true"
                                                icon={icon}
                                                className="text-text-primary"
                                            />
                                        </Link>
                                    </TooltipTrigger>

                                    <TooltipContent className="max-w-48 text-center" side="right">
                                        {label}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {isSelected && (
                                <>
                                    <span
                                        className="absolute invisible md:visible mt-2.5 xl:ml-3.5 lg:ml-2 sm:ml-7
                                        w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] 
                                        border-b-transparent border-r-[10px] border-r-white"
                                    />
                                    <span
                                        className="absolute visible md:invisible mt-[3.2rem] -ml-8 w-0 h-0 
                                        border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent
                                        border-b-[10px] border-b-white"
                                    />
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SideNav;
