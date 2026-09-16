import { vi, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import AllMembersTab from '@/app/groupings/[groupingPath]/@tab/all-members/page';

// Authorization is enforced by the Better Auth-backed grouping layout.
vi.mock('@/app/groupings/[groupingPath]/@tab/_components/grouping-members-tab');

describe('AllMembersTab', () => {
    it('renders AllMembers tab', async () => {
        const component = await AllMembersTab({
            params: Promise.resolve({ groupingPath: 'test' }),
            searchParams: Promise.resolve({ page: '1', sortBy: '1', isAscending: 'true' })
        });

        render(component);
    });
});
