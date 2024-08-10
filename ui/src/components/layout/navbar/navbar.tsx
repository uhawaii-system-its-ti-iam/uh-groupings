import Link from 'next/link';
import Image from 'next/image';
import Role from '@/access/role';
import { getCurrentUser } from '@/access/authentication';
import { NavLinks } from './nav-links';
import LoginButton from './login-button';
import MobileNavbar from './mobile-navbar';
import TimeoutModal from '@/components/modal/timeout-modal';

const Navbar = async () => {
    const currentUser = await getCurrentUser();
    return (
        <>
            <TimeoutModal currentUser={currentUser} />
            <nav className="bg-white border-b-[1px] pointer-events-auto sticky top-0 z-50">
                <div className="container py-2">
                    <div className="flex justify-between">
                        <Link href="/" className="lg:inline hidden">
                            <Image
                                src="/uhgroupings/uh-groupings-logo.svg"
                                alt="UH Groupings Logo"
                                width={256}
                                height={256}
                            />
                        </Link>
                        <div className="flex lg:hidden">
                            <MobileNavbar currentUser={currentUser} />
                            <Link href="/">
                                <Image
                                    src="/uhgroupings/uh-groupings-logo-large.svg"
                                    alt="UH Groupings Logo"
                                    width={56}
                                    height={56}
                                />
                            </Link>
                        </div>
                        <div className="text-lg text-uh-black my-auto lg:space-x-5">
                            {NavLinks
                                .filter((navLink) =>
                                    currentUser.roles.includes(Role.ADMIN) || currentUser.roles.includes(navLink.role))
                                .map((navLink) => 
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
};

export default Navbar;
