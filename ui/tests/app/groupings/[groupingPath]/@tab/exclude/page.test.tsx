import { vi, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import ExcludeTab from '@/app/groupings/[groupingPath]/@tab/exclude/page';

// Authorization is enforced by the Better Auth-backed grouping layout.
vi.mock('@/app/groupings/[groupingPath]/@tab/_components/grouping-members-tab');

describe('ExcludeTab', () => {
    it('renders Exclude tab', async () => {
        const component = await ExcludeTab({
            params: Promise.resolve({ groupingPath: 'test' }),
            searchParams: Promise.resolve({ page: '1', sortBy: '1', isAscending: 'true' })
        });

        render(component);
    });
});
