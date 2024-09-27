import Role from '@/lib/access/role';

export const NavbarLinks = [
    {
        name: 'Admin',
        link: '/admin',
        role: Role.ADMIN
    },
    {
        name: 'Memberships',
        link: '/memberships',
        role: Role.UH
    },
    {
        name: 'Groupings',
        link: '/groupings',
        role: Role.OWNER
    },
    {
        name: 'About',
        link: '/about',
        role: Role.ANONYMOUS
    },
    {
        name: 'Feedback',
        link: '/feedback',
        role: Role.UH
    }
];
