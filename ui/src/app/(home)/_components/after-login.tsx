import Role from '@/access/role';
import Image from 'next/image';
import { KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getNumberOfGroupings, getNumberOfMemberships } from '@/actions/groupings-api';
import { getCurrentUser } from '@/access/authentication';

const AfterLogin = async () => {
    const [currentUser, numberOfGroupings, numberOfMemberships] = await Promise.all([
        getCurrentUser(),
        getNumberOfGroupings(),
        getNumberOfMemberships()
    ]);

    const getHighestRole = () => {
        if (currentUser.roles.includes(Role.ADMIN)) return 'Admin';
        else if (currentUser.roles.includes(Role.OWNER)) return 'Owner';
        else return 'Member';
    };

    const pageInfoItems = [
        {
            title: 'Admin',
            description: 'Manage the list of Administrators for this service.' +
                ' Search for and manage any grouping on behalf of the owner.',
            href: '/admin',
            icon: {
                alt: 'key-solid',
                src: '/uhgroupings/key-solid.svg',
                width: 48,
                height: 48,
            },
            role: Role.ADMIN
        },
        {
            title: 'Memberships',
            description: 'View and manage my memberships. Search for new groupings to join as a member.',
            href: '/memberships',
            icon: {
                src: '/uhgroupings/id-card-solid.svg',
                alt: 'id-card',
                width: 54,
                height: 48,
            },
            number: numberOfMemberships,
            role: Role.UH
        },
        {
            title: 'Groupings',
            description: 'Review members, manage Include and Exclude lists, ' +
                'configure preferences, and export members.',
            href: '/groupings',
            icon: {
                alt: 'wrench-solid',
                src: '/uhgroupings/wrench-solid.svg',
                width: 48,
                height: 48
            },
            number: numberOfGroupings,
            role: Role.OWNER
        }
    ];

    return (
        <main>
            <div className="bg-seafoam pt-5 pb-5">
                <div className="container bg-seafoam pt-7 pb-7">
                    <div className="grid sm:grid-cols-12 text-center justify-center items-center gap-4">
                        <div className="sm:col-span-3 md:col-span-2">
                            <div className="flex justify-center items-center rounded-full
                            h-[100px] w-[100px] bg-white mx-auto relative lg:ml-0">
                                <Image
                                    src="/uhgroupings/user-solid.svg"
                                    alt="user-solid"
                                    width={56}
                                    height={64}
                                />
                                <div
                                    className="bg-blue-background rounded-full flex justify-center
                                    items-center h-[30px] w-[30px] absolute left-3 bottom-0 ml-16">
                                    <KeyRound className="fill-white stroke-none p-0.5" aria-label='key-round'/>
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-9 md:col-span-10 text-center md:text-left">
                            <h1 className="whitespace-nowrap text-[1.75rem]"
                                data-testid="welcome-message">Welcome, <span
                                    className="text-text-color">{currentUser.firstName}</span>!</h1>
                            <h1 className="whitespace-nowrap text-[1.75rem]" data-testid="role">Role: <span
                                className="text-text-color">{getHighestRole()}</span></h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10 mb-10">
                {pageInfoItems
                    .filter((pageInfoItem) => currentUser.roles.includes(pageInfoItem.role))
                    .map((pageInfoItem, index) => (
                        <div key={index} className="flex flex-col justify-between">
                            <div>
                                <div className="flex items-center mb-1">
                                    <Image
                                        alt={pageInfoItem.icon.alt}
                                        src={pageInfoItem.icon.src}
                                        width={pageInfoItem.icon.width}
                                        height={pageInfoItem.icon.height}
                                        className={`mr-5 mb-4 max-w-${pageInfoItem.icon.width} h-auto`}/>
                                    {pageInfoItem.number
                                        && <span className="text-[2.5rem] text-text-color">{pageInfoItem.number}</span>}
                                </div>
                                <h2 className="text-2xl text-text-color font-medium mb-2">{pageInfoItem.title}</h2>
                                <p className="mb-4 text-base font-normal">{pageInfoItem.description}</p>
                            </div>
                            <Link href={pageInfoItem.href}>
                                <Button>{pageInfoItem.title}</Button>
                            </Link>
                        </div>
                    ))}
            </div>
        </main>
    );
};

export default AfterLogin;
