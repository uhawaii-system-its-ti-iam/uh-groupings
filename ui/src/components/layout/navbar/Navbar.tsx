import Link from 'next/link';
import Image from 'next/image';
import LoginButton from './LoginButton';
import { getCurrentUser } from '@/access/AuthenticationService';
import MobileNavbar from './MobileNavbar';
import { NavLinks } from './NavLinks';
import Role from '@/access/Role';

const Navbar = async () => {
    const currentUser = await getCurrentUser();
    
    return ( 
        <nav className="border-b-[1px] pointer-events-auto">
            <div className="container py-2">
                <div className="flex justify-between">
                    <Link href="/" className="lg:inline hidden">
                        <Image 
                            src="uhgroupings/uh-groupings-logo.svg" 
                            alt="UH Groupings Logo" 
                            width={256} 
                            height={256} />
                    </Link>
                    <div className="flex lg:hidden">
                        <MobileNavbar currentUser={currentUser} />
                        <Link href="/">
                            <Image 
                                src="uhgroupings/uh-groupings-logo-large.svg" 
                                alt="UH Groupings Logo" 
                                width={56} 
                                height={56} />
                        </Link>
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
    );
}
 
export default Navbar;
