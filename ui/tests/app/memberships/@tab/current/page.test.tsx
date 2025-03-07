import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import CurrentMembershipsTab from '@/app/memberships/@tab/current/page';
import * as Fetchers from '@/lib/fetchers';
import { MembershipResults } from '@/lib/types';

vi.mock('@/lib/fetchers');
vi.mock('next/navigation', () => ({
    useRouter: vi.fn()
}));

const mockResults: MembershipResults = {
    resultCode: 'SUCCESS',
    results: Array.from({ length: 10 }, (_, i) => ({
        path: `tmp:example:example-${i}`,
        name: `example-${i}`,
        description: `Test Description ${i}`,
    }))
};

beforeEach(() => {
    vi.spyOn(Fetchers, 'membershipResults').mockResolvedValue(mockResults);
});

describe('CurrentMembershipsTab', () => {
    it('renders CurrentMembershipsTab content', async () => {
        render(await CurrentMembershipsTab());
        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        await waitFor(() => {
            mockResults.results.forEach((membership) => {
                expect(screen.getByText(membership.name)).toBeInTheDocument();
                expect(screen.getByText(membership.description)).toBeInTheDocument();
            });
        });
    });
});
