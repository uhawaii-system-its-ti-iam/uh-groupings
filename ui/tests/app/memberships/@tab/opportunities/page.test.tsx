import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import MembershipOpportunitiesTab from '@/app/memberships/@tab/opportunities/page';
import * as Fetchers from '@/lib/fetchers';
import { GroupingPaths } from '@/lib/types';

vi.mock('@/lib/fetchers');
vi.mock('next/navigation', () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));

const mockGroupingPaths: GroupingPaths = {
    resultCode: 'SUCCESS',
    groupingPaths: Array.from({ length: 10 }, (_, i) => ({
        path: `tmp:example:example-${i}`,
        name: `example-${i}`,
        description: `Test Description ${i}`
    }))
};

beforeEach(() => {
    vi.spyOn(Fetchers, 'optInGroupingPaths').mockResolvedValue(mockGroupingPaths);
});

describe('MembershipOpportunitiesTab', () => {
    it('renders MembershipOpportunitiesTab content', async () => {
        render(await MembershipOpportunitiesTab());
        await waitFor(async () => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        await waitFor(async () => {
            mockGroupingPaths.groupingPaths.forEach((opportunity) => {
                expect(screen.getByText(opportunity.name)).toBeInTheDocument();
                expect(screen.getByText(opportunity.description)).toBeInTheDocument();
            });
        });
    });
});
