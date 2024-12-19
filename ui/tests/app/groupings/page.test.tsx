import { render, screen, waitFor } from '@testing-library/react';
import Groupings from '@/app/groupings/page';
import * as Fetchers from '@/lib/fetchers';
import { GroupingPaths } from '@/lib/types';
import { vi, beforeEach, describe, it, expect } from 'vitest';

vi.mock('@/lib/fetchers');

const mockData: GroupingPaths = {
    resultCode: 'SUCCESS',
    groupingPaths: Array.from({ length: 10 }, (_, i) => ({
        path: `tmp:example:example-${i}`,
        name: `example-${i}`,
        description: `Test Description ${i}`
    }))
};

beforeEach(() => {
    vi.spyOn(Fetchers, 'ownerGroupings').mockResolvedValue(mockData);
});

describe('Groupings', () => {
    it('renders the Groupings page with the appropriate header and group data', async () => {
        render(await Groupings());
        await waitFor(async () => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        await waitFor(async () => {
            mockData.groupingPaths.forEach((group) => {
                expect(screen.getByText(group.name)).toBeInTheDocument();
                expect(screen.getByText(group.description)).toBeInTheDocument();
            });
        });
    });
});
