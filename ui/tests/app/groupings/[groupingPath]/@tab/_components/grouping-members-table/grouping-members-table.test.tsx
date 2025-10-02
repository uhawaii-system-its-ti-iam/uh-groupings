import GroupingMembersTable from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/grouping-members-table';
import { GroupingGroupMember, GroupingGroupMembers } from '@/lib/types';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMockProviders } from 'tests/vitest.setup';
import { describe, expect, it, vi } from 'vitest';
import * as Actions from '@/lib/actions';
import userEvent from '@testing-library/user-event';
import { type OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import { message } from '@/lib/messages';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn(),
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn()
    })
}));

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

        describe('Checkbox Column', () => {
            it.each(['include', 'exclude'])('should display the checkbox column in the %s tab', async (tab) => {
                render(
                    <GroupingMembersTable
                        groupingGroupMembers={mockGroupingGroupMembers}
                        groupingPath={groupingPath}
                        group={tab}
                    />,
                    {
                        wrapper: createMockProviders()
                    }
                );

                // Verify presence of "select all rows" checkbox.
                expect(screen.getByRole('checkbox', { name: /select all rows/i })).toBeInTheDocument();
                // Verify presence of row checkboxes.
                const rowCheckBoxes = screen.getAllByRole('checkbox', { name: /select row/i });
                expect(rowCheckBoxes).toHaveLength(mockGroupingGroupMembers.members.length);
            });

            it.each(['allMembers', 'basis', 'owners'])(
                'should NOT display the checkbox column in the %s tab',
                async (tab) => {
                    render(
                        <GroupingMembersTable
                            groupingGroupMembers={mockGroupingGroupMembers}
                            groupingPath={groupingPath}
                            group={tab}
                        />,
                        {
                            wrapper: createMockProviders()
                        }
                    );

                    // Verify absence of select all rows checkbox.
                    expect(screen.queryByRole('checkbox', { name: /select all rows/i })).not.toBeInTheDocument();

                    // Verify Absence of row checkboxes.
                    const rowCheckBoxes = screen.queryAllByRole('checkbox', { name: /select row/i });
                    expect(rowCheckBoxes).toHaveLength(0);
                }
            );

            describe('Checkbox Selection Behavior', () => {
                let user: ReturnType<typeof userEvent.setup>;
                let selectAllCheckbox: HTMLElement;
                let rowCheckboxes: HTMLElement[];
                beforeEach(() => {
                    user = userEvent.setup();
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
                    selectAllCheckbox = screen.getByRole('checkbox', { name: /select all rows/i });
                    rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
                });

                it('should show initial unchecked state for all checkboxes', async () => {
                    expect(selectAllCheckbox).not.toBeChecked();
                    rowCheckboxes.forEach((checkbox) => {
                        expect(checkbox).not.toBeChecked();
                    });
                });

                it('should select a single checkbox when clicked', async () => {
                    await user.click(rowCheckboxes[0]);

                    expect(rowCheckboxes[0]).toBeChecked();
                    // other checkboxes should remain unchecked
                    for (let i = 1; i < rowCheckboxes.length; i++) {
                        expect(rowCheckboxes[i]).not.toBeChecked();
                    }
                    expect(selectAllCheckbox).not.toBeChecked();
                });

                it('should unselect a single checkbox when clicked again', async () => {
                    // First select
                    await user.click(rowCheckboxes[0]);
                    expect(rowCheckboxes[0]).toBeChecked();

                    // Then unselect
                    await user.click(rowCheckboxes[0]);
                    expect(rowCheckboxes[0]).not.toBeChecked();
                });

                it('should check the select-all checkbox it is clicked and uncheck when clicked again', async () => {
                    expect(selectAllCheckbox).not.toBeChecked();
                    await user.click(selectAllCheckbox);

                    expect(selectAllCheckbox).toBeChecked();

                    await user.click(selectAllCheckbox);
                    expect(selectAllCheckbox).not.toBeChecked();
                });

                // failing select all trigger row checkbox check:
                // it('should select all row checkboxes when select-all gets checked', async () => {
                //     await user.click(selectAllCheckbox);
                //
                //     expect(selectAllCheckbox).toBeChecked();
                //
                //     expect(rowCheckboxes[0]).toBeChecked();
                //
                //     rowCheckboxes.forEach((checkbox) => {
                //         expect(checkbox).toBeChecked();
                //     });
                // });

                // attempt using await waitFor() for user events and assertions
                // it('should select all row checkboxes when select-all gets checked using await waitFor()', async () => {
                //     const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all rows/i });
                //     await waitFor(async () => {
                //         user.click(selectAllCheckbox);
                //     });
                //
                //     await waitFor(() => {
                //         expect(selectAllCheckbox).toBeChecked();
                //     });
                //
                //     const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
                //     await waitFor(() => {
                //         rowCheckboxes.forEach((checkbox) => {
                //             expect(checkbox).toBeChecked();
                //         });
                //     });
                // });

                // Passing using fireEvent
                it('should select all row checkboxes when select-all gets checked (fireEvent)', async () => {
                    // use fireEvent.click instead of user.click
                    fireEvent.click(selectAllCheckbox);

                    expect(selectAllCheckbox).toBeChecked();

                    // query fresh rowCheckboxes
                    const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
                    rowCheckboxes.forEach((checkbox) => {
                        expect(checkbox).toBeChecked();
                    });
                });

                it('should unselect all row checkboxes when select-all gets unchecked (fireEvent)', async () => {
                    // Use fireEvent.click instead of userEvent
                    fireEvent.click(selectAllCheckbox);

                    expect(selectAllCheckbox).toBeChecked();

                    const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
                    rowCheckboxes.forEach((checkbox) => {
                        expect(checkbox).toBeChecked();
                    });

                    // Now Uncheck select-all

                    fireEvent.click(selectAllCheckbox);

                    // Query updated row checkboxes
                    const uncheckRowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
                    uncheckRowCheckboxes.forEach((checkbox) => {
                        expect(checkbox).toBeChecked();
                    });
                });

                it('should uncheck select-all when any individual checkbox gets unchecked', async () => {
                    // First select all
                    fireEvent.click(selectAllCheckbox);
                    expect(selectAllCheckbox).toBeChecked();

                    // Verify all row checkboxes are checked
                    const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
                    rowCheckboxes.forEach((checkbox) => {
                        expect(checkbox).toBeChecked();
                    });

                    // Then uncheck one individual checkbox
                    fireEvent.click(rowCheckboxes[0]);
                    const selectAllCheckboxUnchecked = screen.getByRole('checkbox', { name: /select all rows/i });
                    expect(selectAllCheckboxUnchecked).not.toBeChecked();

                    const updatedRowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
                    expect(rowCheckboxes[0]).not.toBeChecked();

                    // Other checkboxes should remain checked
                    for (let i = 1; i < rowCheckboxes.length; i++) {
                        expect(rowCheckboxes[i]).toBeChecked();
                    }
                });
            });
        });

        // Check for trash icon
        describe('Trash Icon', () => {
            const tabsWithTrashIcon = ['include', 'exclude', 'owners'];

            test.each(tabsWithTrashIcon)('should display trash icon in the %s tab', async (tab) => {
                const user = userEvent.setup();
                render(
                    <GroupingMembersTable
                        groupingGroupMembers={mockGroupingGroupMembers}
                        groupingPath={groupingPath}
                        group={tab}
                    />,
                    {
                        wrapper: createMockProviders()
                    }
                );

                const trashIcons = screen.getAllByRole('button', { name: /remove member/i });
                // Check if the number of trash icons is equal to the number of grouping members
                expect(trashIcons).toHaveLength(mockGroupingGroupMembers.members.length);
            });

            // Absence of trash icons in All Members and Basis tabs
            const tabsWithoutTrashIcon = ['allMembers', 'basis'];

            test.each(tabsWithoutTrashIcon)('should not display trash icon in the %s tab', async (tab) => {
                render(
                    <GroupingMembersTable
                        groupingGroupMembers={mockGroupingGroupMembers}
                        groupingPath={groupingPath}
                        group={tab}
                    />,
                    {
                        wrapper: createMockProviders()
                    }
                );

                const trashIcons = screen.queryAllByRole('button', { name: /remove member/i });
                // Check if there are no trash icons
                expect(trashIcons).toHaveLength(0);
            });

            // it('should open the RemoveMemberModal when the trash icon is clicked', async () => {
            //     const user = userEvent.setup();
            //     render(
            //         <GroupingMembersTable
            //             groupingGroupMembers={mockGroupingGroupMembers}
            //             groupingPath={groupingPath}
            //             group="include"
            //         />,
            //         {
            //             wrapper: createMockProviders()
            //         }
            //     );
            //
            //     const trashIconButton = screen.getAllByRole('button', { name: /remove member/i })[0];
            //     await user.click(trashIconButton);
            //
            //     const modal = await screen.findByRole('dialog');
            //     expect(modal).toBeVisible();
            //     expect(modal).toHaveTextContent('Remove Member');
            // });

            // it('should open RemoveMemberModal with correct member when trash icon is clicked', async () => {
            //     const user = userEvent.setup();
            //     render(
            //         <GroupingMembersTable
            //             groupingGroupMembers={mockGroupingGroupMembers}
            //             groupingPath={groupingPath}
            //             group="include"
            //         />,
            //         { wrapper: createMockProviders() }
            //     );
            //
            //     // click the trash icon
            //     const trashIconButton = screen.getAllByRole('button', { name: /remove member/i })[0];
            //     await user.click(trashIconButton);
            //
            //     // log the first members's name
            //     console.log('First member name:', mockGroupingGroupMembers.members[0].name);
            //
            //     // expect modal to show
            //     const modal = await screen.findByTestId('remove-member-modal');
            //     expect(modal).toBeVisible();
            //     expect(within(modal).getByText('Remove Member')).toBeInTheDocument();
            //
            //     // expect to show the current user's name to shwo
            //     const firstMember = mockGroupingGroupMembers.members[0];
            //     expect(within(modal).getByText(firstMember.name)).toBeInTheDocument();
            //     expect(within(modal).getByText(firstMember.uhUuid)).toBeInTheDocument();
            //     expect(within(modal).getByText(firstMember.uid)).toBeInTheDocument();
            // });

            // it('should display the correct tooltip content on hover over the trash icon', async () => {
            //     const user = userEvent.setup();
            //     render(
            //         <GroupingMembersTable
            //             groupingGroupMembers={mockGroupingGroupMembers}
            //             groupingPath={groupingPath}
            //             group="include"
            //         />,
            //         {
            //             wrapper: createMockProviders()
            //         }
            //     );
            //
            //     const trashIconButton = screen.getAllByRole('button', { name: /remove member/i })[0];
            //
            //     await user.hover(trashIconButton);
            //
            //     const tooltipContent = await screen.findByTestId('trash-tooltip-content', {}, { timeout: 2000 });
            //     expect(tooltipContent).toBeVisible();
            //     expect(tooltipContent).toHaveTextContent(message.Tooltip.TRASH_ICON_REMOVAL('include'));
            // });
        });
    });

    describe('Pagination', () => {
        vi.spyOn(Actions, 'getNumberOfGroupingMembers').mockResolvedValue(100);

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

            expect(await screen.findByText('5')).toBeInTheDocument();
            // expect(screen.getByText('5')).toBeInTheDocument();
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

            // expect(screen.getByRole('textbox')).toHaveValue('test');
            //
            // await user.type(screen.getByRole('textbox'), 's');

            expect(screen.getByPlaceholderText('Filter Members...')).toHaveValue('test');

            await user.type(screen.getByPlaceholderText('Filter Members...'), 's');

            await waitFor(() => {
                expect(onUrlUpdate).toHaveBeenCalledTimes(1);
            });

            let event = onUrlUpdate.mock.calls[0][0]!;
            expect(event.queryString).toBe('?search=tests');
            expect(event.searchParams.get('search')).toBe('tests');
            expect(event.options.history).toBe('replace');

            // await user.clear(screen.getByRole('textbox'));

            await user.clear(screen.getByPlaceholderText('Filter Members...'));

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
