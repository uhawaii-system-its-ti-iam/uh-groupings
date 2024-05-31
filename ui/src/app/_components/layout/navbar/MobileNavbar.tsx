'use client';

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet'
import User from '@/access/User';
import Link from 'next/link';
import { NavLinks } from './NavLinks';
import { useState } from 'react';
import Role from '@/access/Role';

const MobileNavbar = ({
    currentUser
} : {
    currentUser: User
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Sheet open={isOpen}>
            <SheetTrigger className="mr-3 lg:hidden" onClick={handleClick} aria-label="Open navigation menu">
                <div className="flex flex-col justify-center items-center">
                    <span className={`bg-black block transition-all transform duration-300 ease-out h-0.5 w-5
                                    rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`} />
                    <span className={`bg-black block transition-all transform duration-300 ease-out h-0.5 w-5 
                                    rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <span className={`bg-black block transition transform duration-300 ease-out h-0.5 w-5 
                                    rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`} />   
                </div>
            </SheetTrigger>
            
            <SheetContent 
                className="mt-[3.9rem] text-xl pt-5 lg:hidden" 
                side="left" 
                onClickOutside={handleClick}>
                <nav className="flex flex-col space-y-5">
                    {NavLinks
                        .filter(navLink =>
                            currentUser.roles.includes(Role.ADMIN) || currentUser.roles.includes(navLink.role))
                        .map(navLink =>
                            <Link 
                                href={navLink.link} 
                                key={navLink.name} 
                                className="hover:text-uh-teal">
                                {navLink.name}
                            </Link>)}
                </nav>
            </SheetContent> 
        </Sheet>
    );
};

 
export default MobileNavbar;
