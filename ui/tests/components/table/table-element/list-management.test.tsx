import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListManagement from '@/components/table/table-element/list-management';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';
import { getMembersExistInInclude, getMembersExistInExclude, getMembersExistInOwners } from '@/lib/actions';

vi.mock('@/lib/actions', () => ({
    getMembersExistInInclude: vi.fn().mockResolvedValue([]),
    getMembersExistInExclude: vi.fn().mockResolvedValue([]),
    getMembersExistInOwners: vi.fn().mockResolvedValue([])
}));
describe('ListManagement Component', () => {
    const mockMembersInInclude = [
        {
            name: 'Testf-iwt-a TestIAM-staff',
            uid: 'testiwta',
            uhUuid: '99997010',
            firstName: 'Testf-iwt-a',
            lastName: 'TestIAM-staff',
            whereListed: 'Include, Owners'
        },
        {
            name: 'Testf-iwt-b TestIAM-staff',
            uid: 'testiwtb',
            uhUuid: '99997027',
            firstName: 'Testf-iwt-b',
            lastName: 'TestIAM-staff',
            whereListed: 'Include, Owners'
        },
        {
            name: 'Testf-iwt-c TestIAM-staff',
            uid: 'testiwtc',
            uhUuid: '99997033',
            firstName: 'Testf-iwt-c',
            lastName: 'TestIAM-staff',
            whereListed: 'Include'
        }
    ];

    const mockMembersInExclude = [
        {
            name: 'Testf-iwt-d TestIAM-faculty',
            uid: 'testiwtd',
            uhUuid: '99997043',
            firstName: 'Testf-iwt-d',
            lastName: 'TestIAM-faculty',
            whereListed: 'Exclude'
        },
        {
            name: 'Testf-iwt-e TestIAM-student',
            uid: 'testiwte',
            uhUuid: '99997056',
            firstName: 'Testf-iwt-e',
            lastName: 'TestIAM-student',
            whereListed: 'Exclude'
        }
    ];

    const mockMembersInOwners = [
        {
            name: 'Testf-iwt-a TestIAM-staff',
            uid: 'testiwta',
            uhUuid: '99997010',
            firstName: 'Testf-iwt-a',
            lastName: 'TestIAM-staff',
            whereListed: 'Include, Owners'
        },
        {
            name: 'Testf-iwt-b TestIAM-staff',
            uid: 'testiwtb',
            uhUuid: '99997027',
            firstName: 'Testf-iwt-b',
            lastName: 'TestIAM-staff',
            whereListed: 'Include, Owners'
        }
    ];

    // Tests for Empty Inputs
    describe('Remove Button Click with Empty Inputs', () => {
        const mockOnOpenManageMemberModal = vi.fn();
        const mockOnOpenManageMembersModal = vi.fn();

        const setup = async (inputValue: string) => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="include"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[]}
                    isPerformingRemoval={false}
                />
            );

            const inputBox = screen.getByPlaceholderText(/UH Username or UH Number/i);
            if (inputValue) {
                await user.type(inputBox, inputValue);
            }

            return { user, inputBox };
        };

        it('should show empty input error when clicking remove with empty input', async () => {
            const { user } = await setup('');
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(screen.getByText(/Please enter one or more UH members./i)).toBeInTheDocument();
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        it('should show empty input error when clicking remove with spaces-only input', async () => {
            const { user } = await setup('   ');
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(screen.getByText(/Please enter one or more UH members./i)).toBeInTheDocument();
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        it('should show empty input error when clicking remove with commas-only input', async () => {
            const { user } = await setup(',,,');
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(screen.getByText(/You must enter a UH Member to add or remove./i)).toBeInTheDocument();
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });
    });

    // Tests for Speical Characters (Non Alphanumeric)
    describe('Remove Button Click with Invalid Raw Text Inputs', () => {
        const mockOnOpenManageMemberModal = vi.fn();
        const mockOnOpenManageMembersModal = vi.fn();

        const setup = async (inputValue: string) => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="include"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[]}
                    isPerformingRemoval={false}
                />
            );

            const inputBox = screen.getByPlaceholderText(/UH Username or UH Number/i);
            if (inputValue) {
                await user.type(inputBox, inputValue);
            }

            return { user, inputBox };
        };

        // Non-alphanumeric input should show error
        it('should reject input of non alphanumeric and throw special characters error', async () => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="include"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[]}
                    isPerformingRemoval={false}
                />
            );

            const inputBox = screen.getByPlaceholderText(/UH Username or UH Number/i);
            await user.type(inputBox, `testiwta!@#$%`);

            const removeButton = screen.getByLabelText(/remove-member-button/i);
            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/Input must contain only alphanumeric characters, separated by commas or spaces./i)
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        it('should reject input of special characters with separators and throw special characters error', async () => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="include"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[]}
                    isPerformingRemoval={false}
                />
            );

            const inputBox = screen.getByPlaceholderText(/UH Username or UH Number/i);
            await user.type(inputBox, `testiwta!@#, testiwtb%^, testiwtc&*()`);

            const removeButton = screen.getByLabelText(/remove-member-button/i);
            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/Input must contain only alphanumeric characters, separated by commas or spaces./i)
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        it('should reject input of special characters mixed separated by valid alphanumeric inputs and throw special characters error', async () => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="include"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[]}
                    isPerformingRemoval={false}
                />
            );

            const inputBox = screen.getByPlaceholderText(/UH Username or UH Number/i);
            await user.type(inputBox, `!@#, testiwta, $%^&, testiwtb, *()_+`);

            const removeButton = screen.getByLabelText(/remove-member-button/i);
            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/Input must contain only alphanumeric characters, separated by commas or spaces./i)
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });
    });

    // Tests for Members In/Not In List Validation
    describe('ListManagement - Members In/Not In Include List Validation', () => {
        const mockOnOpenManageMemberModal = vi.fn();
        const mockOnOpenManageMembersModal = vi.fn();
        const mockMembersInList = mockMembersInInclude;
        const mockMembersNotInList = mockMembersInExclude;

        beforeEach(() => {
            vi.clearAllMocks();
        });

        const setup = async (inputValue: string) => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="include"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[]}
                    isPerformingRemoval={false}
                />
            );

            const inputBox = screen.getByPlaceholderText(/UH Username or UH Number/i);
            if (inputValue) {
                await user.type(inputBox, inputValue);
            }

            return { user, inputBox };
        };

        // Singular member input not in include list, input of 1 member only
        it('should display member not in include list error when removing a member not in the include list', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: []
            });

            const { user } = await setup(mockMembersNotInList[0].uhUuid);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(`Member\\(s\\) not in the list: ${mockMembersNotInList[0].uhUuid}`, 'i')
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Multiple members input not in include list, all inputs are not in the include list
        it('should display members not in include list error when removing multiple members not in the include list', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: []
            });

            const { user } = await setup(`${mockMembersNotInList[0].uhUuid}, ${mockMembersNotInList[1].uhUuid}`);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(
                            `Member\\(s\\) not in the list:\\s+${mockMembersNotInList[0].uhUuid},\\s+${mockMembersNotInList[1].uhUuid}`,
                            'i'
                        )
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Input contains members in the include list and not in the include list
        it('should display member not in include list error with an removal input of members in the include list and one member not in the include list', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: [mockMembersInList[0], mockMembersInList[1]]
            });
            // Example input: 'inList1 inList2 notInList1'

            const { user } = await setup(
                `${mockMembersNotInList[0].uhUuid}, ${mockMembersInList[0].uhUuid}, ${mockMembersInList[1].uhUuid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(`Member\\(s\\) not in the list: ${mockMembersNotInList[0].uhUuid}`, 'i')
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        it('should display members not-in-include-list error with a removal input of members in the include list and members not in the include list', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: [mockMembersInList[0], mockMembersInList[1]]
            });
            // Example input: 'inList1 inList2 notInList1 notInList2'

            const { user } = await setup(
                `${mockMembersNotInList[0].uhUuid}, ${mockMembersNotInList[1].uhUuid}, ${mockMembersInList[0].uhUuid}, ${mockMembersInList[1].uhUuid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(
                            `Member\\(s\\) not in the list: ${mockMembersNotInList[0].uhUuid}, ${mockMembersNotInList[1].uhUuid}`,
                            'i'
                        )
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Valid members in include list
        // Singular member input in include list
        it('should accept the valid singular member input in the include list', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: [mockMembersInList[0]] // Mocks the api response of the input, the response of the API request
            });

            const { user } = await setup(mockMembersInList[0].uhUuid);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            // Verify the API was called with the correct input
            await waitFor(() => {
                expect(getMembersExistInInclude).toHaveBeenCalledWith('/mock/path', [mockMembersInList[0].uhUuid]);
            });

            // Verify the component found the member in the returned list and calls modal
            await waitFor(() => {
                expect(mockOnOpenManageMemberModal).toHaveBeenCalledWith('removeMembers', [mockMembersInList[0]]);
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        // Multiple members input in include list
        it('should accept the valid multiple members input in the include list', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: mockMembersInList
            });

            const { user } = await setup(
                `${mockMembersInList[0].uhUuid}, ${mockMembersInList[1].uhUuid}, ${mockMembersInList[2].uhUuid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(getMembersExistInInclude).toHaveBeenCalledWith('/mock/path', [
                    mockMembersInList[0].uhUuid,
                    mockMembersInList[1].uhUuid,
                    mockMembersInList[2].uhUuid
                ]);
            });

            await waitFor(() => {
                expect(mockOnOpenManageMembersModal).toHaveBeenCalledWith('removeMembers', mockMembersInList);
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });
    });

    describe('ListManagement - Members In/Not In Exclude List Validation', () => {
        const mockOnOpenManageMemberModal = vi.fn();
        const mockOnOpenManageMembersModal = vi.fn();
        const mockMembersInList = mockMembersInExclude;
        const mockMembersNotInList = mockMembersInInclude;

        beforeEach(() => {
            vi.clearAllMocks();
        });

        const setup = async (inputValue: string) => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="exclude"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[]}
                    isPerformingRemoval={false}
                />
            );

            const inputBox = screen.getByPlaceholderText(/UH Username or UH Number/i);
            if (inputValue) {
                await user.type(inputBox, inputValue);
            }

            return { user, inputBox };
        };

        // Singular member input not in exclude list, input of 1 member only
        it('should display member not in exclude list error when removing a member not in the exclude list', async () => {
            vi.mocked(getMembersExistInExclude).mockResolvedValue({
                members: [] // Mocks the api response that none of the inputs of the user are in the exclude list
            });

            const { user } = await setup(mockMembersNotInList[0].uhUuid);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(`Member\\(s\\) not in the list: ${mockMembersNotInList[0].uhUuid}`, 'i')
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Multiple members input not in exclude list, all inputs are not in the exclude list
        it('should display members not in exclude list error when removing multiple members not in the exclude list', async () => {
            vi.mocked(getMembersExistInExclude).mockResolvedValue({
                members: []
            });

            const { user } = await setup(`${mockMembersNotInList[0].uhUuid}, ${mockMembersNotInList[1].uhUuid}`);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(
                            `Member\\(s\\) not in the list:\\s+${mockMembersNotInList[0].uhUuid},\\s+${mockMembersNotInList[1].uhUuid}`,
                            'i'
                        )
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Input contains members in the exclude list and not in the exclude list
        it('should display member not in exclude list error with an removal input of members in the exclude list and one member not in the exclude list', async () => {
            vi.mocked(getMembersExistInExclude).mockResolvedValue({
                members: [mockMembersInList[0], mockMembersInList[1]]
            });
            // Example input: 'inList1 inList2 notInList1'

            const { user } = await setup(
                `${mockMembersNotInList[0].uhUuid}, ${mockMembersInList[0].uhUuid}, ${mockMembersInList[1].uhUuid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(`Member\\(s\\) not in the list: ${mockMembersNotInList[0].uhUuid}`, 'i')
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        it('should display members not-in-exclude-list error with a removal input of members in the exclude list and members not in the exclude list', async () => {
            vi.mocked(getMembersExistInExclude).mockResolvedValue({
                members: [mockMembersInList[0], mockMembersInList[1]]
            });
            // Example input: 'inList1 inList2 notInList1 notInList2'

            const { user } = await setup(
                `${mockMembersNotInList[0].uhUuid}, ${mockMembersNotInList[1].uhUuid}, ${mockMembersInList[0].uhUuid}, ${mockMembersInList[1].uhUuid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(
                            `Member\\(s\\) not in the list: ${mockMembersNotInList[0].uhUuid}, ${mockMembersNotInList[1].uhUuid}`,
                            'i'
                        )
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Valid members in exclude list
        // Singular member input in exclude list
        it('should accept the valid singular member input in the exclude list', async () => {
            vi.mocked(getMembersExistInExclude).mockResolvedValue({
                members: [mockMembersInList[0]]
            });

            const { user } = await setup(mockMembersInList[0].uhUuid);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(getMembersExistInExclude).toHaveBeenCalledWith('/mock/path', [mockMembersInList[0].uhUuid]);
            });

            await waitFor(() => {
                expect(mockOnOpenManageMemberModal).toHaveBeenCalledWith('removeMembers', [mockMembersInList[0]]);
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        // Multiple members input in exclude list
        it('should accept the valid multiple members input in the exclude list', async () => {
            vi.mocked(getMembersExistInExclude).mockResolvedValue({
                members: mockMembersInList
            });

            const { user } = await setup(`${mockMembersInList[0].uhUuid}, ${mockMembersInList[1].uhUuid}`);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(getMembersExistInExclude).toHaveBeenCalledWith('/mock/path', [
                    mockMembersInList[0].uhUuid,
                    mockMembersInList[1].uhUuid
                ]);
            });

            await waitFor(() => {
                expect(mockOnOpenManageMembersModal).toHaveBeenCalledWith('removeMembers', mockMembersInList);
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });
    });

    describe('ListManagement - Members In/Not In Owners List Validation', () => {
        const mockOnOpenManageMemberModal = vi.fn();
        const mockOnOpenManageMembersModal = vi.fn();
        const mockMembersInList = mockMembersInOwners;
        const mockMembersNotInList = mockMembersInExclude;

        beforeEach(() => {
            vi.clearAllMocks();
        });

        const setup = async (inputValue: string) => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="owners"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[]}
                    isPerformingRemoval={false}
                />
            );

            const inputBox = screen.getByPlaceholderText(/UH Username or UH Number/i);
            if (inputValue) {
                await user.type(inputBox, inputValue);
            }

            return { user, inputBox };
        };

        // Singular member input not in owners list, input of 1 member only
        it('should display member not in owners list error when removing a member not in the owners list', async () => {
            vi.mocked(getMembersExistInOwners).mockResolvedValue({
                members: []
            });

            const { user } = await setup(mockMembersNotInList[0].uhUuid);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(`Member\\(s\\) not in the list: ${mockMembersNotInList[0].uhUuid}`, 'i')
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Multiple members input not in owners list, all inputs are not in the owners list
        it('should display members not in owners list error when removing multiple members not in the owners list', async () => {
            vi.mocked(getMembersExistInOwners).mockResolvedValue({
                members: []
            });

            const { user } = await setup(`${mockMembersNotInList[0].uhUuid}, ${mockMembersNotInList[1].uhUuid}`);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(
                            `Member\\(s\\) not in the list:\\s+${mockMembersNotInList[0].uhUuid},\\s+${mockMembersNotInList[1].uhUuid}`,
                            'i'
                        )
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Input contains members in the owners list and not in the owners list
        it('should display member not in owners list error with an removal input of members in the owners list and one member not in the owners list', async () => {
            vi.mocked(getMembersExistInOwners).mockResolvedValue({
                members: [mockMembersInList[0], mockMembersInList[1]]
            });
            // Example input: 'inList1 inList2 notInList1'

            const { user } = await setup(
                `${mockMembersNotInList[0].uhUuid}, ${mockMembersInList[0].uhUuid}, ${mockMembersInList[1].uhUuid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(`Member\\(s\\) not in the list: ${mockMembersNotInList[0].uhUuid}`, 'i')
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        it('should display members not-in-owners-list error with a removal input of members in the owners list and members not in the owners list', async () => {
            vi.mocked(getMembersExistInOwners).mockResolvedValue({
                members: [mockMembersInList[0], mockMembersInList[1]]
            });
            // Example input: 'inList1 inList2 notInList1 notInList2'

            const { user } = await setup(
                `${mockMembersNotInList[0].uhUuid}, ${mockMembersNotInList[1].uhUuid}, ${mockMembersInList[0].uhUuid}, ${mockMembersInList[1].uhUuid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(
                            `Member\\(s\\) not in the list: ${mockMembersNotInList[0].uhUuid}, ${mockMembersNotInList[1].uhUuid}`,
                            'i'
                        )
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Valid members in owners list
        // Singular member input in owners list
        it('should accept the valid singular member input in the owners list', async () => {
            vi.mocked(getMembersExistInOwners).mockResolvedValue({
                members: [mockMembersInList[0]]
            });

            const { user } = await setup(mockMembersInList[0].uhUuid);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(getMembersExistInOwners).toHaveBeenCalledWith('/mock/path', [mockMembersInList[0].uhUuid]);
            });

            await waitFor(() => {
                expect(mockOnOpenManageMemberModal).toHaveBeenCalledWith('removeMembers', [mockMembersInList[0]]);
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        // Multiple members input in owners list
        it('should accept the valid multiple members input in the owners list', async () => {
            vi.mocked(getMembersExistInOwners).mockResolvedValue({
                members: mockMembersInList
            });

            const { user } = await setup(`${mockMembersInList[0].uhUuid}, ${mockMembersInList[1].uhUuid}`);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(getMembersExistInOwners).toHaveBeenCalledWith('/mock/path', [
                    mockMembersInList[0].uhUuid,
                    mockMembersInList[1].uhUuid
                ]);
            });

            await waitFor(() => {
                expect(mockOnOpenManageMembersModal).toHaveBeenCalledWith('removeMembers', mockMembersInList);
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });
    });

    // Tests for Duplicate Members in Input
    describe('Remove Button Click with Duplicate Members in Input', () => {
        const mockOnOpenManageMemberModal = vi.fn();
        const mockOnOpenManageMembersModal = vi.fn();

        beforeEach(() => {
            vi.clearAllMocks();
        });

        const setup = async (inputValue: string) => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="include"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[]}
                    isPerformingRemoval={false}
                />
            );

            const inputBox = screen.getByPlaceholderText(/UH Username or UH Number/i);
            if (inputValue) {
                await user.type(inputBox, inputValue);
            }

            return { user, inputBox };
        };

        // Input with a single member of duplicate uhUuids
        it('should display duplicate members error when removing duplicate uhIdentifiers in input of a single member', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: [mockMembersInInclude[0]]
            });

            const { user } = await setup(`${mockMembersInInclude[0].uhUuid}, ${mockMembersInInclude[0].uhUuid}`);
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(new RegExp(`Duplicate member.*${mockMembersInInclude[0].uhUuid}`, 'i'))
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Input with multiple members of duplicate uhUuids
        it('should display duplicate members error when removing multiple duplicate member uhUuids in input', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: [mockMembersInInclude[0], mockMembersInInclude[1]]
            });

            const { user } = await setup(
                `${mockMembersInInclude[0].uhUuid}, ${mockMembersInInclude[0].uhUuid}, ${mockMembersInInclude[1].uhUuid}, ${mockMembersInInclude[1].uhUuid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);

            await user.click(removeButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        new RegExp(
                            `Duplicate member\\(s\\) in the input:\\s+\\[${mockMembersInInclude[0].uhUuid}\\],\\s*\\[${mockMembersInInclude[1].uhUuid}\\]`,
                            'i'
                        )
                    )
                ).toBeInTheDocument();
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Input with a member's uhuuid and uid both present, each uhIdentifier count is no more than 1 should be ACCEPTED
        // Example input: 'inListUID inListUhuuid'
        it('should accept when removing an input that contains both the uhUuid and uid of a member', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: [mockMembersInInclude[0]]
            });

            const { user } = await setup(`${mockMembersInInclude[0].uhUuid}, ${mockMembersInInclude[0].uid}`);
            const removeButton = screen.getByLabelText(/remove-member-button/i);
            await user.click(removeButton);

            // Verify the API was called with the correct input
            await waitFor(() => {
                expect(getMembersExistInInclude).toHaveBeenCalledWith('/mock/path', [
                    mockMembersInInclude[0].uhUuid,
                    mockMembersInInclude[0].uid
                ]);
            });

            // Verify the component found testiwta in the returned list and calls modal
            await waitFor(() => {
                expect(mockOnOpenManageMemberModal).toHaveBeenCalledWith('removeMembers', [mockMembersInInclude[0]]);
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        // Input with multiple members' uhUuid and uid both present, each uhIdentifier count is no more than 1 should be ACCEPTED
        // Example input: 'inList1UID inList1UhUuid inList2UID inList2UhUuid'
        it('should accept when removing an input that contains both the uhUuid and uid for multiple members', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: [mockMembersInInclude[0], mockMembersInInclude[1]]
            });

            const { user } = await setup(
                `${mockMembersInInclude[0].uhUuid}, ${mockMembersInInclude[0].uid}, ${mockMembersInInclude[1].uhUuid}, ${mockMembersInInclude[1].uid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);
            await user.click(removeButton);

            await waitFor(() => {
                expect(getMembersExistInInclude).toHaveBeenCalledWith('/mock/path', [
                    mockMembersInInclude[0].uhUuid,
                    mockMembersInInclude[0].uid,
                    mockMembersInInclude[1].uhUuid,
                    mockMembersInInclude[1].uid
                ]);
            });

            await waitFor(() => {
                expect(mockOnOpenManageMembersModal).toHaveBeenCalledWith('removeMembers', [
                    mockMembersInInclude[0],
                    mockMembersInInclude[1]
                ]);
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });

        // Input of a member's uhUuid and uid along with duplicate of either identifier should ACCEPT
        // Example input: 'inListUID inListUID inListUhuuid' - both identifiers present, so accept
        it('should accept when removing an input that contains both the uhUuid and uid for a member along with a duplicate of either identifier', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: [mockMembersInInclude[0]]
            });

            const { user } = await setup(
                `${mockMembersInInclude[0].uid}, ${mockMembersInInclude[0].uid}, ${mockMembersInInclude[0].uhUuid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);
            await user.click(removeButton);

            await waitFor(() => {
                expect(getMembersExistInInclude).toHaveBeenCalledWith('/mock/path', [
                    mockMembersInInclude[0].uid,
                    mockMembersInInclude[0].uid,
                    mockMembersInInclude[0].uhUuid
                ]);
            });

            // Verify the component accepts it and calls modal (since both uid and uhUuid are present)
            await waitFor(() => {
                expect(mockOnOpenManageMemberModal).toHaveBeenCalledWith('removeMembers', [mockMembersInInclude[0]]);
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        // Input of multiple members' uhUuid and uid along with duplicates of either identifier should ACCEPT
        // Example input: 'user1uid user1uid user1uhuuid user2uid user2uhuuid user2uhuuid' - both identifiers present for each, so accept
        it('should accept when removing an input that contains both the uhUuid and uid for multiple members along with duplicates of either identifier', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: [mockMembersInInclude[0], mockMembersInInclude[1]]
            });

            const { user } = await setup(
                `${mockMembersInInclude[0].uid},${mockMembersInInclude[0].uid}, ${mockMembersInInclude[0].uhUuid}, 
                   ${mockMembersInInclude[1].uid}, ${mockMembersInInclude[1].uhUuid}, ${mockMembersInInclude[1].uhUuid}`
            );
            const removeButton = screen.getByLabelText(/remove-member-button/i);
            await user.click(removeButton);

            await waitFor(() => {
                expect(getMembersExistInInclude).toHaveBeenCalled();
            });

            // Verify the component accepts it and calls modal with both members (since both identifiers are present for each)
            await waitFor(() => {
                expect(mockOnOpenManageMembersModal).toHaveBeenCalledWith('removeMembers', [
                    mockMembersInInclude[0],
                    mockMembersInInclude[1]
                ]);
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });
    });

    // Tests Precedence if there are checkedMembers
    describe('List Management Removal Precedence', () => {
        const mockOnOpenManageMemberModal = vi.fn();
        const mockOnOpenManageMembersModal = vi.fn();

        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should prioritize input members over checked members when both are present', async () => {
            vi.mocked(getMembersExistInInclude).mockResolvedValue({
                members: [mockMembersInInclude[0]]
            });

            const user = userEvent.setup();
            render(
                <ListManagement
                    list="include"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[mockMembersInInclude[1], mockMembersInInclude[2]]}
                    isPerformingRemoval={false}
                />
            );

            const inputBox = screen.getByPlaceholderText(/UH Username or UH Number/i);
            await user.type(inputBox, mockMembersInInclude[0].uhUuid);

            const removeButton = screen.getByLabelText(/remove-member-button/i);
            await user.click(removeButton);

            await waitFor(() => {
                expect(mockOnOpenManageMemberModal).toHaveBeenCalledWith('removeMembers', [mockMembersInInclude[0]]);
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        it('should use checked members when input is empty', async () => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="include"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[mockMembersInInclude[0]]}
                    isPerformingRemoval={false}
                />
            );

            const removeButton = screen.getByLabelText(/remove-member-button/i);
            await user.click(removeButton);

            await waitFor(() => {
                expect(mockOnOpenManageMemberModal).toHaveBeenCalledWith('removeMembers', [mockMembersInInclude[0]]);
            });

            expect(mockOnOpenManageMembersModal).not.toHaveBeenCalled();
        });

        it('should use multiple checked members when input is empty', async () => {
            const user = userEvent.setup();
            render(
                <ListManagement
                    list="include"
                    groupingPath="/mock/path"
                    onOpenManageMemberModal={mockOnOpenManageMemberModal}
                    onOpenManageMembersModal={mockOnOpenManageMembersModal}
                    checkedMembers={[mockMembersInInclude[0], mockMembersInInclude[1]]}
                    isPerformingRemoval={false}
                />
            );

            const removeButton = screen.getByLabelText(/remove-member-button/i);
            await user.click(removeButton);

            await waitFor(() => {
                expect(mockOnOpenManageMembersModal).toHaveBeenCalledWith('removeMembers', [
                    mockMembersInInclude[0],
                    mockMembersInInclude[1]
                ]);
            });

            expect(mockOnOpenManageMemberModal).not.toHaveBeenCalled();
        });
    });
});
