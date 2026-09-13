import { vi, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import IncludeTab from '@/app/groupings/[groupingPath]/@tab/include/page';

// Authorization is enforced by the Better Auth-backed grouping layout.
vi.mock('@/app/groupings/[groupingPath]/@tab/_components/grouping-members-tab');

describe('IncludeTab', () => {
    it('renders Include tab', async () => {
        render(
            <IncludeTab
                params={{ groupingPath: 'test' }}
                searchParams={{ page: '1', sortBy: '1', isAscending: 'true' }}
            />
        );
    });
});
