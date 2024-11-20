import { vi, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import AllMembersTab from '@/app/groupings/[groupingPath]/@tab/all-members/page';

vi.mock('next-cas-client/app');

// TODO: React Testing Library does not support rendering nested server components yet.
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
