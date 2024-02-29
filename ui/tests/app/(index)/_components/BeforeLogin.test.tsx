import { render, screen } from '@testing-library/react';
import BeforeLogin from '@/app/(index)/_components/BeforeLogin';
describe('BeforeLogin Component', () => {

    it('renders UHGroupingsInfo and a button with correct text and link', ()=> {
        render(<BeforeLogin />);
        const size = 'text-[1.2rem]';
        const linkUrl = 'https://uhawaii.atlassian.net/wiki/spaces/UHIAM/pages/13403213/UH+Groupings';
        expect(screen.getByRole('heading', {name:'What is a UH Grouping?'}))
            .toHaveClass('text-text-color');
        expect(screen.getByTestId('description')).toBeInTheDocument();

        expect(screen.getByAltText('Cogs icon')).toHaveAttribute('src', '/uhgroupings/cogs.svg');
        expect(screen.getByText('Create groupings, manage grouping memberships, control members\' ' +
            'self-service options, designate sync destinations, and more.')).toHaveClass(size);

        expect(screen.getByAltText('Email icon')).toHaveAttribute('src', '/uhgroupings/id-email.svg');
        expect(screen.getByText('Synchronize groupings email LISTSERV lists,' +
            ' attributes for access control via CAS and LDAP, etc..')).toHaveClass(size);

        expect(screen.getByAltText('Watch icon')).toHaveAttribute('src', '/uhgroupings/watch.svg');
        expect(screen.getByText('Leverage group data from official sources,' +
            ' which can substantially reduce the manual overhead of membership management.')).toHaveClass(size);

        expect(screen.getByRole('link')).toHaveAttribute('href', linkUrl);
        expect(screen.getByRole('button', {name:'Learn More'})).toBeInTheDocument();
    });
});

