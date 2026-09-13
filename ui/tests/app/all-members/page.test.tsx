import { vi, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import AllMembersTab from '@/app/groupings/[groupingPath]/@tab/all-members/page';

// Authorization is enforced by the Better Auth-backed grouping layout.
vi.mock('@/app/groupings/[groupingPath]/@tab/_components/grouping-members-tab');

describe('AllMembersTab', () => {
    it('renders AllMembers tab', async () => {
        render(
            <AllMembersTab
                params={{ groupingPath: 'test' }}
                searchParams={{ page: '1', sortBy: '1', isAscending: 'true' }}
            />
        );
    });
});
