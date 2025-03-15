import ImageItem from '@/app/about/_components/image-item';

const UHGroupingsInfo = ({ size }: { size?: 'lg' | 'default' }) => {
    const color = size === 'lg' ? 'text-text-color' : 'text-uh-black';

    const infoItems = [
        {
            description:
                `Create groupings, manage grouping memberships, control members' self-service options, ` +
                'designate sync destinations, and more.',
            icon: {
                src: '/uhgroupings/cogs.svg',
                alt: 'Cogs icon'
            }
        },
        {
            description:
                'Synchronize groupings email LISTSERV lists, ' +
                'attributes for access control via CAS and LDAP, etc..',
            icon: {
                src: '/uhgroupings/id-email.svg',
                alt: 'Email icon'
            }
        },
        {
            description:
                'Leverage group data from official sources, ' +
                'which can substantially reduce the manual overhead of membership management.',
            icon: {
                src: '/uhgroupings/watch.svg',
                alt: 'Watch icon'
            }
        }
    ];

    return (
        <div className="bg-seafoam pt-10 pb-10">
            <div className="container">
                <div className="grid">
                    <h1 className={`text-center text-[2.5rem] font-medium ${color}`}>What is a UH Grouping?</h1>
                    <p className="text-center text-[1.25rem] font-light" data-testid="description">
                        A <em>grouping</em> is a collection of members (e.g., all full-time Hilo faculty).
                    </p>
                </div>
                <ImageItem data={infoItems} size={size} />
            </div>
        </div>
    );
};

export default UHGroupingsInfo;
