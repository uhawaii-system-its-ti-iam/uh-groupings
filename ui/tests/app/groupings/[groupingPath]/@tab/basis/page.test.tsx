import { vi, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import BasisTab from '@/app/groupings/[groupingPath]/@tab/basis/page';

// Authorization is enforced by the Better Auth-backed grouping layout.
vi.mock('@/app/groupings/[groupingPath]/@tab/_components/grouping-members-tab');

describe('BasisTab', () => {
    it('renders Basis tab', async () => {
        const component = await BasisTab({
            params: Promise.resolve({ groupingPath: 'test' }),
            searchParams: Promise.resolve({ page: '1', sortBy: '1', isAscending: 'true' })
        });

        render(component);
    });
});
