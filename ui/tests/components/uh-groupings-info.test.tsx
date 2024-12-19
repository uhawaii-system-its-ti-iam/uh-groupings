import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import UHGroupingsInfo from '@/components/uh-groupings-info';

describe('UHGroupings Component', () => {
    const expectCogs = (size: 'text-[1.2rem]' | 'text-base') => {
        const description =
            `Create groupings, manage grouping memberships, control members' ` +
            'self-service options, designate sync destinations, and more.';
        expect(screen.getByAltText('Cogs icon')).toHaveAttribute('src', '/uhgroupings/cogs.svg');
        expect(screen.getByText(description)).toHaveClass(size);
    };

    const expectEmail = (size: 'text-[1.2rem]' | 'text-base') => {
        const description =
            'Synchronize groupings email LISTSERV lists,' + ' attributes for access control via CAS and LDAP, etc..';
        expect(screen.getByAltText('Email icon')).toHaveAttribute('src', '/uhgroupings/id-email.svg');
        expect(screen.getByText(description)).toHaveClass(size);
    };

    const expectWatch = (size: 'text-[1.2rem]' | 'text-base') => {
        const description =
            'Leverage group data from official sources,' +
            ' which can substantially reduce the manual overhead of membership management.';
        expect(screen.getByAltText('Watch icon')).toHaveAttribute('src', '/uhgroupings/watch.svg');
        expect(screen.getByText(description)).toHaveClass(size);
    };

    it('renders with variant prop', () => {
        render(<UHGroupingsInfo size="lg" />);
        expect(screen.getByRole('heading', { name: 'What is a UH Grouping?' })).toHaveClass('text-text-color');
        expect(screen.getByTestId('description')).toBeInTheDocument();
        expectCogs('text-[1.2rem]');
        expectEmail('text-[1.2rem]');
        expectWatch('text-[1.2rem]');
    });

    it('renders without variant prop', () => {
        render(<UHGroupingsInfo />);
        expect(screen.getByRole('heading', { name: 'What is a UH Grouping?' })).toHaveClass('text-uh-black');
        expect(screen.getByTestId('description')).toBeInTheDocument();
        expectCogs('text-base');
        expectEmail('text-base');
        expectWatch('text-base');
    });
});
