import Link from 'next/link';
import Image from 'next/image';
import Role from '@/access/role';
import { getCurrentUser } from '@/access/authentication';
import { NavLinks } from './nav-links';
import LoginButton from './login-button';
import MobileNavbar from './mobile-navbar';
import TimeoutModal from '../modal/timeout-modal';

const Navbar = async () => {
    const currentUser = await getCurrentUser();
    return (
        <>
            <TimeoutModal currentUser={currentUser} />
            <nav className="bg-white border-b-[1px] pointer-events-auto sticky top-0 z-50">
                <div className="container py-2">
                    <div className="flex justify-between">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/uhgroupings/uh-groupings-logo.svg"
                                alt="UH Groupings Logo"
                                width={256}
                                height={44.850}
                                sizes="(max-width: 574px) 210px, (max-width: 991px) 256px, (max-width: 1199px) 252.087px, (min-width: 1200px) 256px"
                                className="w-[210px] h-[38.550px] sm:w-[256px] sm:h-[47px] lg:w-[252.087px] lg:h-[46.275px] xl:w-[256px] xl:h-[44.850px]"
                            />
                        </Link>
                        <div className="flex lg:hidden">
                            <MobileNavbar currentUser={currentUser} />
                        </div>
                        <div className="text-lg text-uh-black my-auto lg:space-x-5">
                            {NavLinks
                                .filter(navLink =>
                                    currentUser.roles.includes(Role.ADMIN) || currentUser.roles.includes(navLink.role))
                                .map(navLink =>
                                    <Link
                                        href={navLink.link}
                                        key={navLink.name}
                                        className="hover:text-uh-teal lg:inline hidden">
                                        {navLink.name}
                                    </Link>)}
                            <LoginButton currentUser={currentUser} />
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
