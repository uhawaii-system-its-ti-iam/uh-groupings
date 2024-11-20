import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { GroupingGroupMember } from '@/lib/types';
import GroupingMembersTab from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-tab';
import { createMockProviders } from 'tests/vitest.setup';
import * as Actions from '@/lib/actions';
import SortBy from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/table-element/sort-by';

vi.mock('@/lib/actions');

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

describe('GroupingMembersTab', () => {
    const groupingPath = 'tmp:testiwta:testiwta-aux';
    const group = 'include';
    const groupPath = `${groupingPath}:${group}`;

    const mockGroupingMembers = {
        resultCode: 'SUCCESS',
        groupPath: groupingPath,
        size: pageSize,
        members: Array.from(
            { length: 20 },
            (_, i) =>
                ({
                    uid: `uid-${i}`,
                    uhUuid: `uhUuid-${i}`,
                    name: `name-${i}`,
                    firstName: `firstName-${i}`,
                    lastName: `lastName-${i}`
                }) as GroupingGroupMember
        )
    };

    it('should render the GroupingsMembersTable', async () => {
        vi.spyOn(Actions, 'getGroupingMembers').mockResolvedValue(mockGroupingMembers);
        render(
            await GroupingMembersTab({
                params: { groupingPath },
                searchParams: {
                    page: '1',
                    sortBy: 'name',
                    isAscending: 'true'
                }
            }),
            { wrapper: createMockProviders() }
        );

        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should parse the searchParams', async () => {
        render(
            await GroupingMembersTab({
                params: { groupingPath },
                searchParams: {
                    page: 'notAnInteger',
                    sortBy: '123',
                    isAscending: 'yes'
                }
            }),
            { wrapper: createMockProviders() }
        );

        // Verify pagination bar is on page 1.
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.queryByText('4')).not.toBeInTheDocument();

        // Verify sort arrow is sorting descending for the name column.
        expect(
            within(screen.getByRole('columnheader', { name: 'Name' })).getByTestId('chevron-down-icon')
        ).toBeInTheDocument();
    });

    it('should call getGroupingMembers', async () => {
        vi.spyOn(Actions, 'getGroupingMembers').mockResolvedValue(mockGroupingMembers);
        const searchParams = {
            page: 1,
            size: pageSize,
            sortBy: SortBy.NAME,
            isAscending: true,
            searchString: 'test'
        };

        const { rerender } = render(
            await GroupingMembersTab({
                params: { groupingPath },
                searchParams: {
                    page: '1',
                    sortBy: 'name',
                    isAscending: 'true',
                    search: 'test'
                }
            }),
            { wrapper: createMockProviders() }
        );
        expect(Actions.getGroupingMembers).toHaveBeenCalledWith(groupingPath, searchParams);

        rerender(
            await GroupingMembersTab({
                params: { groupingPath },
                searchParams: {
                    page: '1',
                    sortBy: 'name',
                    isAscending: 'true',
                    search: 'test'
                },
                group
            })
        );
        expect(Actions.getGroupingMembers).toHaveBeenCalledWith(groupPath, searchParams);
    });
});
