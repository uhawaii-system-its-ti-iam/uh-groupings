import GroupingMembersTable from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/grouping-members-table';
import { GroupingGroupMember, GroupingGroupMembers } from '@/lib/types';
import { render, screen, waitFor, within } from '@testing-library/react';
import { createMockProviders } from 'tests/vitest.setup';
import { describe, expect, it, vi } from 'vitest';
import * as Actions from '@/lib/actions';
import userEvent from '@testing-library/user-event';
import { type OnUrlUpdateFunction } from 'nuqs/adapters/testing';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

describe('GroupingMembersTable', () => {
    const groupingPath = 'tmp:testiwta:testiwta-aux';
    const groupingMembers = Array.from(
        { length: pageSize },
        (_, i) =>
            ({
                uid: `uid-${i}`,
                uhUuid: `uhUuid-${i}`,
                name: `name-${i}`,
                firstName: `firstName-${i}`,
                lastName: `lastName-${i}`
            }) as GroupingGroupMember
    );
    const mockGroupingGroupMembers = {
        resultCode: 'SUCCESS',
        groupPath: 'tmp:testiwta:testiwta-aux',
        size: pageSize,
        members: groupingMembers
    } as GroupingGroupMembers;

    describe('Columns', () => {
        it('should not display the "Basis?" or "Listing" columns in the Basis and Owners tabs', async () => {
            const { rerender } = render(
                <GroupingMembersTable
                    groupingGroupMembers={mockGroupingGroupMembers}
                    groupingPath={groupingPath}
                    group="basis"
                />,
                {
                    wrapper: createMockProviders()
                }
            );
            expect(screen.queryByText('Basis?')).not.toBeInTheDocument();
            expect(screen.queryByText('Listing')).not.toBeInTheDocument();

            rerender(
                <GroupingMembersTable
                    groupingGroupMembers={mockGroupingGroupMembers}
                    groupingPath={groupingPath}
                    group="owners"
                />
            );
            expect(screen.queryByText('Basis?')).not.toBeInTheDocument();
            expect(screen.queryByText('Listing')).not.toBeInTheDocument();
        });

        describe('Listing', () => {
            it('should display the column in the All Members tab', async () => {
                render(
                    <GroupingMembersTable
                        groupingGroupMembers={mockGroupingGroupMembers}
                        groupingPath={groupingPath}
                    />,
                    {
                        wrapper: createMockProviders()
                    }
                );

                expect(screen.getByText('Listing')).toBeInTheDocument();
            });

            it('should call getGroupingMembersWhereListed with the current page members', async () => {
                const getGroupingMembersWhereListedSpy = vi.spyOn(Actions, 'getGroupingMembersWhereListed');
                getGroupingMembersWhereListedSpy.mockResolvedValue({
                    members: mockGroupingGroupMembers.members.slice(0, pageSize).map((member) => ({
                        ...member,
                        whereListed: 'Basis & Include'
                    }))
                });

                render(
                    <GroupingMembersTable
                        groupingGroupMembers={mockGroupingGroupMembers}
                        groupingPath={groupingPath}
                    />,
                    {
                        wrapper: createMockProviders()
                    }
                );

                expect(getGroupingMembersWhereListedSpy).toHaveBeenCalledWith(
                    groupingPath,
                    mockGroupingGroupMembers.members.slice(0, pageSize).map((member) => member.uhUuid)
                );
            });
        });

        describe('Basis?', () => {
            it('should display the column in the Include and Exclude tabs', async () => {
                const { rerender } = render(
                    <GroupingMembersTable
                        groupingGroupMembers={mockGroupingGroupMembers}
                        groupingPath={groupingPath}
                        group="include"
                    />,
                    {
                        wrapper: createMockProviders()
                    }
                );
                expect(screen.getByText('Basis?')).toBeInTheDocument();

                rerender(
                    <GroupingMembersTable
                        groupingGroupMembers={mockGroupingGroupMembers}
                        groupingPath={groupingPath}
                        group="exclude"
                    />
                );
                expect(screen.getByText('Basis?')).toBeInTheDocument();
            });

            it('should call getGroupingMembersIsBasis with the current page members', async () => {
                const getGroupingMembersIsBasisSpy = vi.spyOn(Actions, 'getGroupingMembersIsBasis');
                getGroupingMembersIsBasisSpy.mockResolvedValue({
                    members: mockGroupingGroupMembers.members.slice(0, pageSize).map((member) => ({
                        ...member,
                        whereListed: 'Basis'
                    }))
                });

                render(
                    <GroupingMembersTable
                        groupingGroupMembers={mockGroupingGroupMembers}
                        groupingPath={groupingPath}
                        group="include"
                    />,
                    {
                        wrapper: createMockProviders()
                    }
                );

                expect(getGroupingMembersIsBasisSpy).toHaveBeenCalledWith(
                    groupingPath,
                    mockGroupingGroupMembers.members.slice(0, pageSize).map((member) => member.uhUuid)
                );
            });
        });
    });

    describe('Pagination', () => {
        it('should match the page searchParam to the table', async () => {
            const user = userEvent.setup();
            const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

            render(
                <GroupingMembersTable
                    groupingGroupMembers={mockGroupingGroupMembers}
                    groupingPath={groupingPath}
                    group="include"
                />,
                {
                    wrapper: createMockProviders('?page=5', onUrlUpdate)
                }
            );

            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.queryByText('2')).not.toBeInTheDocument();

            await user.click(screen.getByText('3'));

            expect(screen.getByText('2')).toBeInTheDocument();
            expect(onUrlUpdate).toHaveBeenCalledOnce();

            const event = onUrlUpdate.mock.calls[0][0]!;
            expect(event.queryString).toBe('?page=3');
            expect(event.searchParams.get('page')).toBe('3');
            expect(event.options.history).toBe('replace');
        });

        it('should disable the "Last" button until getNumberOfGroupingMembers resolves', async () => {
            const { rerender } = render(
                <GroupingMembersTable
                    groupingGroupMembers={mockGroupingGroupMembers}
                    groupingPath={groupingPath}
                    group="include"
                />,
                {
                    wrapper: createMockProviders()
                }
            );
            expect(screen.getByTestId('pagination-last')).toHaveClass('cursor-not-allowed');

            vi.spyOn(Actions, 'getNumberOfGroupingMembers').mockResolvedValue(100);
            rerender(
                <GroupingMembersTable
                    groupingGroupMembers={mockGroupingGroupMembers}
                    groupingPath={groupingPath}
                    group="include"
                />
            );
            await waitFor(() => {
                expect(screen.getByTestId('pagination-last')).toHaveClass('cursor-pointer');
            });
        });
    });

    describe('Sorting', () => {
        it('should match the sortBy and isAscending searchParams to the table', async () => {
            const user = userEvent.setup();
            const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

            render(
                <GroupingMembersTable
                    groupingGroupMembers={mockGroupingGroupMembers}
                    groupingPath={groupingPath}
                    group="include"
                />,
                {
                    wrapper: createMockProviders('?sortBy=uid&isAscending=false', onUrlUpdate)
                }
            );

            expect(
                within(screen.getByRole('columnheader', { name: 'UH Username' })).getByTestId('chevron-up-icon')
            ).toBeInTheDocument();

            // Verify isAscending becomes true (removed from searchParams)
            await user.click(screen.getByTestId('chevron-up-icon'));

            expect(onUrlUpdate).toHaveBeenCalledTimes(1);

            let event = onUrlUpdate.mock.calls[0][0]!;
            expect(event.queryString).toBe('?sortBy=uid');
            expect(event.searchParams.get('isAscending')).toBeNull();
            expect(event.options.history).toBe('replace');

            // Verify correct sortBy values in searchParams
            await user.click(screen.getByRole('columnheader', { name: 'Name' }));

            expect(onUrlUpdate).toHaveBeenCalledTimes(2);

            event = onUrlUpdate.mock.calls[1][0]!;
            expect(event.queryString).toBe('');
            expect(event.searchParams.get('sortBy')).toBeNull();
            expect(event.searchParams.get('isAscending')).toBeNull();
            expect(event.options.history).toBe('replace');

            await user.click(screen.getByRole('columnheader', { name: 'UH Number' }));

            expect(onUrlUpdate).toHaveBeenCalledTimes(3);

            event = onUrlUpdate.mock.calls[2][0]!;
            expect(event.queryString).toBe('?sortBy=uhUuid');
            expect(event.searchParams.get('isAscending')).toBeNull();
            expect(event.options.history).toBe('replace');
        });
    });

    describe('Search', () => {
        it('should match the search searchParam to the table', async () => {
            const user = userEvent.setup();
            const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

            render(
                <GroupingMembersTable
                    groupingGroupMembers={mockGroupingGroupMembers}
                    groupingPath={groupingPath}
                    group="include"
                />,
                {
                    wrapper: createMockProviders('?search=test', onUrlUpdate)
                }
            );

            expect(screen.getByRole('textbox')).toHaveValue('test');

            await user.type(screen.getByRole('textbox'), 's');

            await waitFor(() => {
                expect(onUrlUpdate).toHaveBeenCalledTimes(1);
            });

            let event = onUrlUpdate.mock.calls[0][0]!;
            expect(event.queryString).toBe('?search=tests');
            expect(event.searchParams.get('search')).toBe('tests');
            expect(event.options.history).toBe('replace');

            await user.clear(screen.getByRole('textbox'));

            await waitFor(() => {
                expect(onUrlUpdate).toHaveBeenCalledTimes(2);
            });

            event = onUrlUpdate.mock.calls[1][0]!;
            expect(event.queryString).toBe('');
            expect(event.searchParams.get('search')).toBeNull();
            expect(event.options.history).toBe('replace');
        });
    });
});
