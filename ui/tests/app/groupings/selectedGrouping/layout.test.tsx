import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectedGroupingLayout from '@/app/groupings/[selectedGrouping]/layout';
import { groupingDescription } from '@/lib/fetchers';
import { usePathname } from 'next/navigation';
import {GroupingDescription} from '@/lib/types';
import GroupingHeader from '@/app/groupings/[selectedGrouping]/_components/grouping-header';

jest.mock('@/lib/fetchers');
jest.mock('@/app/groupings/[selectedGrouping]/_components/grouping-header');

const mockData: GroupingDescription = {
    groupPath: 'Test-path:Test-name',
    description: 'Test Description',
    resultCode: 'SUCCESS'
}

beforeEach(() => {
    (groupingDescription as jest.Mock).mockResolvedValue(mockData);
    (usePathname as jest.Mock).mockReturnValue('/groupings/Test-Path/Test-name');
});

describe('SelectedGroupingLayout', () => {

    it('fetches data and correctly extracts groupPath, groupDescription, and groupName', async () => {
        render(await SelectedGroupingLayout({
            params: { selectedGrouping: 'Test-Path:Test-name' },
            tab: <div>Tab Content</div>
        }));

        const groupPath = mockData?.groupPath || '';
        const groupDescription = mockData?.description || '';
        const groupName = groupPath.split(':').pop() || '';

        expect(groupPath).toBe('Test-path:Test-name');
        expect(groupDescription).toBe('Test Description');
        expect(groupName).toBe('Test-name');

        expect(GroupingHeader).toHaveBeenCalledWith({
            groupName: 'Test-name',
            groupPath: 'Test-path:Test-name',
            groupDescription: 'Test Description'
        }, {});
    });

    it('handles empty path', async () => {
        (groupingDescription as jest.Mock).mockResolvedValueOnce(undefined);
        render(await SelectedGroupingLayout({
            params: { selectedGrouping: 'Test-Path:Test-name' },
            tab: <div>Tab Content</div>
        }));

        const groupPath = '';
        const groupDescription = '';
        const groupName = '';

        expect(GroupingHeader).toHaveBeenCalledWith({
            groupName,
            groupPath,
            groupDescription
        }, {});
    });

    it('renders the tab content', async () => {
        render(await SelectedGroupingLayout({
            params: { selectedGrouping: 'Test-Path:Test-name' },
            tab: <div>Tab Content</div>
        }));

        const tabContent = await screen.findByTestId('tab-content');
        expect(tabContent).toBeInTheDocument();
        expect(tabContent).toHaveTextContent('Tab Content');
    });
});
