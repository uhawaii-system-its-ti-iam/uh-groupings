import { vi, describe, beforeEach, it, expect } from 'vitest';
import Memberships from '@/app/memberships/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/fetchers', () => ({
    membershipResults: vi.fn().mockResolvedValue({ results: [] }),
    optInGroupingPaths: vi.fn().mockResolvedValue({ groupingPaths: [] })
}));

describe('Memberships Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render memberships tab', async () => {
        render(await Memberships());
        expect(await screen.findByText('Current Memberships')).toBeInTheDocument();
        expect(screen.getByText('Membership Opportunities')).toBeInTheDocument();
    });
});
