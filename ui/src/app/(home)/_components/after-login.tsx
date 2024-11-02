import Role from '@/access/role';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faKey, faIdCard, faWrench, faUser} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getNumberOfGroupings, getNumberOfMemberships } from '@/lib/fetchers';
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
            description:
                'Manage the list of Administrators for this service.' +
                ' Search for and manage any grouping on behalf of the owner.',
            href: '/admin',
            icon: faKey,
            width: 48,
            height: 48,
            role: Role.ADMIN,
            ariaLabel: 'key'
        },
        {
            title: 'Memberships',
            description: 'View and manage my memberships. Search for new groupings to join as a member.',
            href: '/memberships',
            icon: faIdCard,
            width: 54,
            height: 48,
            number: numberOfMemberships,
            role: Role.UH,
            ariaLabel: 'id-card'
        },
        {
            title: 'Groupings',
            description:
                'Review members, manage Include and Exclude lists, ' + 'configure preferences, and export members.',
            href: '/groupings',
            icon: faWrench,
            width: 48,
            height: 48,
            number: numberOfGroupings,
            role: Role.OWNER,
            ariaLabel: 'wrench'
        }
    ];

    return (
        <main>
            <div className="bg-seafoam pt-5 pb-5">
                <div className="container bg-seafoam pt-7 pb-7">
                    <div className="grid sm:grid-cols-12 text-center justify-center items-center gap-4">
                        <div className="sm:col-span-3 md:col-span-2">
                            <div
                                className="flex justify-center items-center rounded-full
                            h-[100px] w-[100px] bg-white mx-auto relative lg:ml-0"
                            >
                                <FontAwesomeIcon className="w-14 h-16" aria-label="user" icon={faUser} />
                                <div
                                    className="bg-blue-background rounded-full flex justify-center
                                    items-center h-[30px] w-[30px] absolute left-3 bottom-0 ml-16"
                                >
                                    <FontAwesomeIcon className="text-white stroke-none p-0.5" aria-label="key-round" icon={faKey} />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-9 md:col-span-10 text-center md:text-left">
                            <h1 className="whitespace-nowrap text-[1.75rem]" data-testid="welcome-message">
                                Welcome, <span className="text-text-color">{currentUser.firstName}</span>!
                            </h1>
                            <h1 className="whitespace-nowrap text-[1.75rem]" data-testid="role">
                                Role: <span className="text-text-color">{getHighestRole()}</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10 mb-10">
                {pageInfoItems
                    .filter(
                        (pageInfoItem) =>
                            currentUser.roles.includes(Role.ADMIN) || currentUser.roles.includes(pageInfoItem.role)
                    )
                    .map((pageInfoItem, index) => (
                        <div key={index} className="flex flex-col justify-between">
                            <div>
                                <div className="flex items-center mb-1">
                                    <FontAwesomeIcon icon={pageInfoItem.icon} style={{ width: `${pageInfoItem.width}px`, height: `${pageInfoItem.height}px` }} className="mr-5 mb-4 max-w-${pageInfoItem.icon.width} h-auto text-text-primary" aria-label={pageInfoItem.ariaLabel} />
                                    {pageInfoItem.number !== null && (
                                        <span className="text-[2.5rem] text-text-color ">{pageInfoItem.number}</span>
                                    )}
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
