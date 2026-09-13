import { vi, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import OwnersTab from '@/app/groupings/[groupingPath]/@tab/owners/page';

// Authorization is enforced by the Better Auth-backed grouping layout.
vi.mock('@/app/groupings/[groupingPath]/@tab/_components/grouping-members-tab');

describe('OwnersTab', () => {
    it('renders Owners tab', async () => {
        render(
            <OwnersTab
                params={{ groupingPath: 'test' }}
                searchParams={{ page: '1', sortBy: '1', isAscending: 'true' }}
            />
        );
    });
});
