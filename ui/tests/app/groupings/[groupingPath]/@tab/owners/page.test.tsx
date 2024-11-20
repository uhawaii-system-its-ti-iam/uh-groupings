import { vi, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import OwnersTab from '@/app/groupings/[groupingPath]/@tab/owners/page';

vi.mock('next-cas-client/app');

// TODO: React Testing Library does not support rendering nested server components yet.
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
