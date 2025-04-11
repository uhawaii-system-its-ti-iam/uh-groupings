import { vi, beforeEach, describe, it, expect, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import GroupingPathLayout from '@/app/groupings/[groupingPath]/layout';
import { groupingDescription, groupingPathIsValid, isAdmin, isGroupingOwner } from '@/lib/fetchers';
import { usePathname, redirect } from 'next/navigation';
import { GroupingDescription } from '@/lib/types';
import GroupingHeader from '@/app/groupings/[groupingPath]/_components/grouping-header';
import { getCurrentUser } from 'next-cas-client/app';

vi.mock('next/navigation');
vi.mock('@/lib/fetchers');
vi.mock('@/app/groupings/[groupingPath]/_components/grouping-header');
vi.mock('next-cas-client/app');

const mockData: GroupingDescription = {
    groupPath: 'Test-path:Test-name',
    description: 'Test Description',
    resultCode: 'SUCCESS'
};

beforeEach(() => {
    vi.clearAllMocks();
    (getCurrentUser as Mock).mockResolvedValue({ uid: 'test-user' });
    (isAdmin as Mock).mockResolvedValue(false);
    (isGroupingOwner as Mock).mockResolvedValue(true);
    (groupingDescription as Mock).mockResolvedValue(mockData);
    (groupingPathIsValid as Mock).mockResolvedValue(true);
    (usePathname as Mock).mockReturnValue('/groupings/Test-Path/Test-name');
});

describe('GroupingPathLayout', () => {
    it('fetches data and correctly extracts groupPath, groupDescription, and groupName', async () => {
        const params = { groupingPath: 'Test-path:Test-name' };
        render(
            await GroupingPathLayout({
                params,
                tab: <div>Tab Content</div>
            })
        );

        const groupPath = params.groupingPath;
        const groupDescription = mockData?.description;
        const groupName = groupPath.split(':').pop();

        expect(groupPath).toBe('Test-path:Test-name');
        expect(groupDescription).toBe('Test Description');
        expect(groupName).toBe('Test-name');

        expect(GroupingHeader).toHaveBeenCalledWith(
            {
                groupName: 'Test-name',
                groupPath: 'Test-path:Test-name',
                groupDescription: 'Test Description'
            },
            {}
        );
    });

    it('renders the tab content', async () => {
        render(
            await GroupingPathLayout({
                params: { groupingPath: 'Test-path:Test-name' },
                tab: <div>Tab Content</div>
            })
        );

        const tabContent = await screen.findByTestId('tab-content');
        expect(tabContent).toBeInTheDocument();
        expect(tabContent).toHaveTextContent('Tab Content');
    });

    it('redirects if path is invalid', async () => {
        (groupingPathIsValid as Mock).mockResolvedValue(false);

        await GroupingPathLayout({
            params: { groupingPath: 'Invalid:path' },
            tab: <div>Tab Content</div>
        });

        expect(redirect).toHaveBeenCalledWith('/');
    });

    it('redirects if user is not admin and not owner', async () => {
        (isAdmin as Mock).mockResolvedValue(false);
        (isGroupingOwner as Mock).mockResolvedValue(false);

        await GroupingPathLayout({
            params: { groupingPath: 'Test-path:Test-name' },
            tab: <div>Tab Content</div>
        });

        expect(redirect).toHaveBeenCalledWith('/');
    });

    it('should not redirect if user is admin or owner', async () => {
        (isAdmin as Mock).mockResolvedValue(true);

        await GroupingPathLayout({
            params: { groupingPath: 'Test-path:Test-name' },
            tab: <div>Tab Content</div>
        });

        expect(redirect).not.toHaveBeenCalled();
    });
});
