import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AllMembersTab from '@/app/groupings/[groupingPath]/@tab/all-members/page';

describe('AllMembersTab', () => {
    it('renders AllMembers tab', () => {
        render(<AllMembersTab />);
        const heading = screen.getByRole('heading', { name: /all members/i });
        expect(heading).toBeInTheDocument();
    });
});
