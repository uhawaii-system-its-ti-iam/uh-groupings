import Link from 'next/link';
import Image from 'next/image';
import { NavbarLinks } from './navbar-links';
import LoginButton from './login-button';
import NavbarMenu from './navbar-menu';
import TimeoutModal from '@/components/modal/timeout-modal';
import { getUser } from '@/lib/access/user';
import Role from '@/lib/access/role';

const Navbar = async () => {
    const currentUser = await getUser();
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
                            <NavbarMenu currentUser={currentUser} />
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
                            {NavbarLinks.filter(
                                (navbarLink) =>
                                    currentUser.roles.includes(Role.ADMIN) ||
                                    currentUser.roles.includes(navbarLink.role)
                            ).map((navbarLink) => (
                                <Link
                                    href={navbarLink.link}
                                    key={navbarLink.name}
                                    className="hover:text-uh-teal lg:inline hidden"
                                >
                                    {navbarLink.name}
                                </Link>
                            ))}
                            <LoginButton currentUser={currentUser} />
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
