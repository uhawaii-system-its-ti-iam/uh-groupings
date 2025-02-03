import { vi, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import ExcludeTab from '@/app/groupings/[groupingPath]/@tab/exclude/page';

vi.mock('next-cas-client/app');

// TODO: React Testing Library does not support rendering nested server components yet.
vi.mock('@/app/groupings/[groupingPath]/@tab/_components/grouping-members-tab');

describe('ExcludeTab', () => {
    it('renders Exclude tab', async () => {
        render(
            <ExcludeTab
                params={{ groupingPath: 'test' }}
                searchParams={{ page: '1', sortBy: '1', isAscending: 'true' }}
            />
        );
    });
});
