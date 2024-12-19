//TODO: import AdminLayout from '@/app/admin/layout';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import Admin from '@/app/admin/page';
import { render, screen, waitFor } from '@testing-library/react';
import * as Fetchers from '@/lib/fetchers';
import { MemberResult, GroupingPaths } from '@/lib/types';
import Groupings from '@/app/groupings/page';

vi.mock('@/lib/fetchers');

const mockGroupingsData: GroupingPaths = {
    resultCode: 'SUCCESS',
    groupingPaths: Array.from({ length: 10 }, (_, i) => ({
        path: `tmp:example:example-${i}`,
        name: `example-${i}`,
        description: `Test Description ${i}`
    }))
};

const mockAdminsData: MemberResult = {
    resultCode: 'SUCCESS',
    members: Array.from({ length: 10 }, (_, i) => ({
        name: `example-${i}`,
        uid: `example-${i}`,
        uhUuid: `example-${i}`
    }))
};

beforeEach(() => {
    vi.spyOn(Fetchers, 'ownerGroupings').mockResolvedValue(mockGroupingsData);
    vi.spyOn(Fetchers, 'groupingAdmins').mockResolvedValue(mockAdminsData);
});

describe('Groupings', () => {
    it('renders the Groupings page with the appropriate header and group data', async () => {
        render(await Groupings());
        await waitFor(async () => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        await waitFor(async () => {
            mockGroupingsData.groupingPaths.forEach((group) => {
                expect(screen.getByText(group.name)).toBeInTheDocument();
                expect(screen.getByText(group.description)).toBeInTheDocument();
            });
        });
    });
});

describe('Admin', () => {
    it('should render the Admin page with the appropriate header and tabs', async () => {
        render(await Admin());

        await waitFor(async () => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        await waitFor(async () => {
            expect(screen.getByRole('main')).toBeInTheDocument();
        });

        /*expect(screen.getByRole('heading', { name: 'UH Groupings Administration' })).toBeInTheDocument();
        expect(
            screen.getByText(
                'Search for and manage any grouping on behalf of its owner. ' +
                    'Manage the list of UH Groupings administrators.'
            )
        ).toBeInTheDocument();*/

        await waitFor(async () => {
            expect(screen.getByRole('tablist')).toBeInTheDocument();
        });
        await waitFor(async () => {
            expect(screen.getByRole('tab', { name: 'Manage Groupings' })).toBeInTheDocument();
        });
        await waitFor(async () => {
            expect(screen.getByRole('tab', { name: 'Manage Admins' })).toBeInTheDocument();
        });
        await waitFor(async () => {
            expect(screen.getByRole('tab', { name: 'Manage Person' })).toBeInTheDocument();
        });
    });
});
