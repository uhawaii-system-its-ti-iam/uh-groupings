import { render, screen } from '@testing-library/react';
import AllMembersTab from '@/app/groupings/[selectedGrouping]/@tab/all/page';

describe('AllMembersTab', () => {
    it('renders AllMembers tab', () => {
        render(<AllMembersTab />);
        const heading = screen.getByRole('heading', { name: /allmembers/i });
        expect(heading).toBeInTheDocument();
    });
});
