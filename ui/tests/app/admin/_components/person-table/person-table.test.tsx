import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as Actions from '@/lib/actions';
import { removeFromGroups, getNumberOfDirectOwners } from '@/lib/actions';
import User from '@/lib/access/user';
import userEvent from '@testing-library/user-event';
import { MembershipResults } from '@/lib/types';
import PersonTable from '@/app/admin/_components/person-table/person-table';

vi.mock('@/lib/actions', () => ({
    groupingOwners: vi.fn(),
    removeFromGroups: vi.fn(),
    getNumberOfDirectOwners: vi.fn(),
}));


vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn()
    })
}));

const mockResults = Array.from({ length: 200 }, (_, i) => ({
    path: `tmp:example:example-${i}`,
    name: `example-${i}`,
    description: `Test Description ${i}`,
    inBasis: true,
    inInclude: true,
    inExclude: true,
    inOwner: true,
    inBasisAndInclude: true,
    optOutEnabled: true,
    optInEnabled: true,
    selfOpted: true
}));

const mockMembershipResults = {
    resultCode: 'SUCCESS',
    results: mockResults
};

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const admin: User = JSON.parse(process.env.TEST_USER_A as string);
const user: User = JSON.parse(process.env.TEST_USER_B as string);

const searchUser = (uid: string) => {
    const input = screen.getAllByPlaceholderText('UH Username');
    fireEvent.change(input[0], {
        target: { value: uid }
    });

    const button = screen.getAllByRole('button', { name: 'Search' });
    fireEvent.click(button[0]);
};

describe('PersonTable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the header and filter correctly', async () => {
        render(
            <PersonTable
                membershipResults={mockMembershipResults}
                memberResult={admin}
                uhIdentifier={admin.uid}
                showWarning={false}
            />
        );

        const title = screen.queryAllByText('Manage Person');
        expect(title.length).toBeGreaterThan(0);

        await waitFor(() => {
            const filter = screen.queryAllByPlaceholderText('Filter Groupings...');
            expect(filter.length).toBeGreaterThan(0);
        });

        expect(screen.getByText('Grouping')).toBeInTheDocument();
        expect(screen.getByText('Owner?')).toBeInTheDocument();
        expect(screen.getByText('Basis?')).toBeInTheDocument();
        expect(screen.getByText('Include?')).toBeInTheDocument();
        expect(screen.getByText('Exclude?')).toBeInTheDocument();
        expect(screen.getAllByTestId('person-remove')[0]).toBeInTheDocument();

        expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(mockResults.length);

        const firstPageGroupings = mockResults.slice(0, pageSize);
        firstPageGroupings.forEach((group) => {
            expect(screen.getAllByTestId('fa-up-right-from-square-icon')[0]).toBeInTheDocument();
            expect(screen.getByText(group.name)).toBeInTheDocument();
            expect(screen.getAllByTestId('owners-icon')[0]).toBeInTheDocument();
        });
    });

    it('renders tooltip on hover over Search button', async () => {
        render(
            <PersonTable
                membershipResults={mockMembershipResults}
                memberResult={admin}
                uhIdentifier={admin.uid}
                showWarning={false}
            />
        );

        const searchButton = screen.getByRole('button', { name: 'Search' });
        await waitFor(async () => {
            await userEvent.hover(searchButton);
        });

        await waitFor(() => {
            const tooltip = screen.getAllByRole('tooltip', { name: 'Specify a person to manage their grouping(s)' })[0];
            expect(tooltip).toBeInTheDocument();
        });
    });

    it('renders user info when a valid user is found', async () => {
        render(
            <PersonTable
                membershipResults={mockMembershipResults}
                memberResult={admin}
                uhIdentifier={admin.uid}
                showWarning={false}
            />
        );

        searchUser(`${admin.uid}`);
        const input = screen.getAllByPlaceholderText('UH Username')[0];
        fireEvent.blur(input);

        const searchButton = screen.getByText('Search');
        fireEvent.blur(searchButton);

        const result = screen.getByText(`(${admin.name}, ${admin.uid}, ${admin.uhUuid})`);
        expect(result).toBeInTheDocument();
    });

    it('renders error message when empty input is submitted', async () => {
        render(<PersonTable
                membershipResults={mockMembershipResults}
                memberResult={undefined}
                uhIdentifier={''}
                showWarning={false}
            />
        );

        searchUser('');
        const error = screen.getAllByText('You must enter a UH member to search')[0];
        expect(error).toBeInTheDocument();
    });

    it('renders error message when multiple entries are submitted', async () => {
        render(<PersonTable
                membershipResults={mockMembershipResults}
                memberResult={admin}
                uhIdentifier={''}
                showWarning={false}
            />
        );
        searchUser(`${admin.uid}, ${user.uid}`);

        const error = screen.getAllByText('You can only search one UH member at a time')[0];
        expect(error).toBeInTheDocument();
    });

    it('renders alert when no user data is found', async () => {
        render(<PersonTable
                membershipResults={[] as MembershipResults}
                memberResult={undefined}
                uhIdentifier={admin.uid}
                showWarning={true}
            />
        );
        const alert = screen.getAllByText(`No user data found for ${admin.uid}. Check the entered UH member and try again.`)[0];
        expect(alert).toBeInTheDocument();

        const removeButton = screen.getAllByRole('button', { name: 'Remove' })[0];
        await userEvent.click(removeButton);
        const removeModal = screen.queryByRole('alertdialog');
        expect(removeModal).not.toBeInTheDocument();
    });

    it('renders alert when no user data is found given numeric input', async () => {
        const mockFailedFindUser = { resultCode: 'FAILURE', results: [] };

        render(
            <PersonTable
                membershipResults={mockFailedFindUser}
                memberResult={admin}
                uhIdentifier={'1234'}
                showWarning={true}
            />
        );

        const input = screen.getAllByPlaceholderText('UH Username')[0];
        fireEvent.change(input, {
            target: { value: 1234 }
        });
        fireEvent.blur(input);

        const searchButton = screen.getByText('Search');
        await userEvent.click(searchButton);

        const alert = screen.queryByText(`No user data found for 1234. Check the entered UH member and try again.`);
        expect(alert).toBeInTheDocument();
    });

    it('renders the owners modal when the crown icon is clicked on', async () => {
        render(<PersonTable
                membershipResults={mockMembershipResults}
                memberResult={admin}
                uhIdentifier={''}
                showWarning={false}
            />
        );
        searchUser(admin.uid);

        const icon = screen.getAllByTestId('owners-icon')[0];
        await userEvent.click(icon);

        const modal = await screen.findByRole('alertdialog');
        expect(modal).toBeInTheDocument();

        expect(screen.getByText('Owners')).toBeInTheDocument();
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByText('UH Number')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();

        const closeButton = screen.getAllByRole('button', { name: 'Close' })[0];
        await userEvent.click(closeButton);
        expect(modal).not.toBeInTheDocument();
    });

    it('renders alert if user tries to remove with no groupings selected', async () => {
        render(<PersonTable
                membershipResults={mockMembershipResults}
                memberResult={admin}
                uhIdentifier={''}
                showWarning={false}
            />
        );
        searchUser(admin.uid);

        const removeButton = screen.getAllByRole('button', { name: 'Remove' })[0];
        await userEvent.click(removeButton);

        const alert =  screen.queryByText('No Groupings have been selected.');
        expect(alert).toBeInTheDocument();
    });

    it('opens error modal when user is the sole owner of a grouping', async () => {
        render(<PersonTable
                membershipResults={mockMembershipResults}
                memberResult={admin}
                uhIdentifier={admin.uid}
                showWarning={false}
            />
        );
        vi.spyOn(Actions, 'getNumberOfDirectOwners').mockResolvedValue(1);

        const checkboxes = screen.getAllByTestId('person-remove')[0];
        await userEvent.click(checkboxes);
        const removeButton = screen.getAllByRole('button', { name: 'Remove' })[0];
        await userEvent.click(removeButton);

        expect(getNumberOfDirectOwners).toHaveBeenCalled();

        const modal = await waitFor(() => screen.findByRole('alertdialog'));
        expect(modal).toBeInTheDocument();
        const modalTitle = screen.getByText('Error Removing User');
        expect(modalTitle).toBeInTheDocument();
    });

    it('opens Remove modal if the Remove All Checkbox box is clicked', async () => {
        render(<PersonTable
                membershipResults={mockMembershipResults}
                memberResult={admin}
                uhIdentifier={admin.uid}
                showWarning={false}
            />
        );
        vi.spyOn(Actions, 'getNumberOfDirectOwners').mockResolvedValue(2);

        const removeAllCheckbox = screen.getAllByRole('checkbox', { name: 'Check All Remove' })[0];
        await userEvent.click(removeAllCheckbox);
        expect(removeAllCheckbox.disabled).toBe(false);
        expect(removeAllCheckbox.checked).toBe(true);

        const firstPageGroupings = mockResults.slice(0, pageSize);
        firstPageGroupings.forEach((group, i) => {
            expect(screen.getAllByTestId('person-remove')[i]).toBeInTheDocument();
            expect(screen.getAllByTestId('person-remove')[i]).toBeChecked();
        });

        const removeButton = screen.getAllByRole('button', { name: 'Remove' })[0];
        await userEvent.click(removeButton);

        const modal = await screen.findByRole('alertdialog');
        expect(modal).toBeInTheDocument();
        const modalTitle = screen.getByText('Remove Member From Groups');
        expect(modalTitle).toBeInTheDocument();
    });

    it('does not call removeFromGroups if the uhIdentifier is not provided', async () => {
        render(<PersonTable
                membershipResults={mockMembershipResults}
                memberResult={admin}
                uhIdentifier={undefined}
                showWarning={false}
            />
        );
        searchUser(admin.uid);

        const removeCheckbox = screen.getAllByTestId('person-remove')[0];
        await userEvent.click(removeCheckbox);
        const removeButton = screen.getAllByRole('button', { name: 'Remove' })[0];
        await userEvent.click(removeButton);

        const removeModal = await screen.findByRole('alertdialog');
        expect(removeModal).toBeInTheDocument();
        const confirmButton = screen.queryByTestId('yes-button');
        await userEvent.click(confirmButton);
        await waitFor(() => {
            expect(removeFromGroups).not.toHaveBeenCalled();
        });
    });

    it('calls removeFromGroups with correct groups when Yes is clicked on the Remove Modal', async () => {
        render(
            <PersonTable
                membershipResults={mockMembershipResults}
                memberResult={admin}
                uhIdentifier={admin.uid}
                showWarning={false}
            />
        );
        vi.spyOn(Actions, 'getNumberOfDirectOwners').mockResolvedValue(2);

        const removeCheckbox = screen.getAllByTestId('person-remove')[0];
        await userEvent.click(removeCheckbox);
        const removeButton = screen.getAllByRole('button', { name: 'Remove' })[0];
        await userEvent.click(removeButton);

        const modal = await screen.findByRole('alertdialog');
        expect(modal).toBeInTheDocument();
        const modalTitle = screen.getByText('Remove Member From Groups');
        expect(modalTitle).toBeInTheDocument();
        const confirmButton = screen.queryByTestId('yes-button');
        await userEvent.click(confirmButton);

        expect(removeFromGroups).toHaveBeenCalled();
        const [[uid, groups]] = (removeFromGroups as unknown as vi.Mock).mock.calls;
        expect(uid).toBe(admin.uid);
        expect(groups).toEqual(['tmp:example:example-0:owners', 'tmp:example:example-0:include', 'tmp:example:example-0:exclude']);
    });

    it('disables the Remove All Checkbox if there are no groupings', async () => {
        const mockEmptyGroupingsInfo = { resultCode: 'SUCCESS', results: [] };
        render(<PersonTable
                membershipResults={mockEmptyGroupingsInfo}
                memberResult={admin}
                uhIdentifier={admin.uid}
                showWarning={true}
            />
        );
        const groupingsInfo = mockEmptyGroupingsInfo.results;
        const resultCode = mockEmptyGroupingsInfo.resultCode;
        expect(resultCode).toBe('SUCCESS');
        expect(groupingsInfo.length).toBe(0);
        const removeAllCheckbox = screen.getAllByRole('checkbox', { name: 'Check All Remove' })[0];
        expect(removeAllCheckbox).toBeDisabled();
        expect(removeAllCheckbox.checked).toBe(false);
    });
});
