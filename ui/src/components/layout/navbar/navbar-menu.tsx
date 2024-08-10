'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import User from '@/access/user';
import Link from 'next/link';
import { NavbarLinks } from './navbar-links';
import { useState } from 'react';
import Role from '@/access/role';
import NavbarMenuIcon from './navbar-menu-icon';

const NavbarMenu = ({ currentUser }: { currentUser: User }) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Sheet open={open}>
            <SheetTrigger className="mr-3 lg:hidden" onClick={handleClick} aria-label="Open navigation menu">
                <NavbarMenuIcon open={open} aria-hidden="true" />
            </SheetTrigger>

            <SheetContent className="mt-[3.9rem] text-xl pt-5 lg:hidden" side="top" onClickOutside={handleClick}>
                <nav className="container flex flex-col space-y-5 h-1/4">
                    {NavbarLinks
                        .filter((navbarLink) =>
                            currentUser.roles.includes(Role.ADMIN) || 
                            currentUser.roles.includes(navbarLink.role))
                        .map((navbarLink) => 
                            <Link href={navbarLink.link} key={navbarLink.name} className="hover:text-uh-teal">
                                {navbarLink.name}
                            </Link>)}
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default NavbarMenu;
