const refreshMock = vi.fn();

vi.mock('next/navigation', async () => {
    const actual = await vi.importActual<typeof import('next/navigation')>('next/navigation');
    return {
        ...actual,
        useRouter: () => ({
            refresh: refreshMock,
        }),
    };
});


import { describe, it, vi, expect, beforeEach, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Actions from '@/app/groupings/[groupingPath]/@tab/_components/grouping-actions';
import {
    resetIncludeGroup,
    resetIncludeGroupAsync,
    resetExcludeGroup,
    resetExcludeGroupAsync,
} from '@/lib/actions';

vi.mock('@/lib/actions');

beforeAll(() => {
    if (typeof global.ResizeObserver === 'undefined') {
        class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        }
        global.ResizeObserver = ResizeObserver;
    }
});

describe('Actions Component', () => {
    const shortGroupingPath = 'test%3Apath%3AgroupName';
    const longGroupingPath = 'test:' + 'a'.repeat(751) + ':groupNameLong';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the initial UI correctly', async () => {
        render(<Actions groupingPath={shortGroupingPath} />);
        expect(screen.getByText('Grouping Actions')).toBeInTheDocument();
        expect(screen.getByText('Reset Include')).toBeInTheDocument();
        expect(screen.getByText('Reset Exclude')).toBeInTheDocument();
        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        expect(resetBtn).toBeDisabled();
    });

    it('enables Reset Selected button when include checkbox is toggled', async () => {
        render(<Actions groupingPath={shortGroupingPath} />);
        const user = userEvent.setup();
        const includeCheckbox = screen.getByRole('checkbox', { name: /reset include/i });
        await user.click(includeCheckbox);
        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        expect(resetBtn).toBeEnabled();
    });

    it('enables Reset Selected button when exclude checkbox is toggled', async () => {
        render(<Actions groupingPath={shortGroupingPath} />);
        const user = userEvent.setup();
        const excludeCheckbox = screen.getByRole('checkbox', { name: /reset exclude/i });
        await user.click(excludeCheckbox);
        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        expect(resetBtn).toBeEnabled();
    });

    it('shows spinner after confirming reset, then displays success modal with Ok button', async () => {
        (resetIncludeGroup as any).mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => resolve({ resultCode: 'SUCCESS' }), 500);
            })
        );
        render(<Actions groupingPath={shortGroupingPath} />);
        const user = userEvent.setup();
        const includeCheckbox = screen.getByRole('checkbox', { name: /reset include/i });
        await user.click(includeCheckbox);
        await waitFor(() => {
            expect(includeCheckbox).toBeChecked();
        });
        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        await user.click(resetBtn);
        const modal = await screen.findByRole('alertdialog', { name: /reset grouping/i });
        expect(modal).toBeInTheDocument();
        expect(modal).toHaveTextContent(/include list/i);
        expect(modal).toHaveTextContent(/groupName/i);
        const yesButton = screen.getByText('Yes');
        await user.click(yesButton);

        await waitFor(() => {
            expect(screen.queryByRole('alertdialog', { name: /reset grouping/i })).not.toBeInTheDocument();
        });
        const spinnerContainer = document.querySelector('#loading-spinner');
        expect(spinnerContainer).not.toBeNull();
        await waitFor(() => {
            expect(resetIncludeGroup).toHaveBeenCalledWith(decodeURIComponent(shortGroupingPath));
        });
        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
        const successModal = await screen.findByRole('alertdialog', { name: /grouping reset completion/i });
        expect(successModal).toBeInTheDocument();
        expect(successModal).toHaveTextContent('The Include list has successfully been reset.');
        const okButton = screen.getByRole('button', { name: /ok/i });
        expect(okButton).toBeInTheDocument();
        await user.click(okButton);
        await waitFor(() => {
            expect(screen.queryByRole('alertdialog', { name: /grouping reset completion/i })).not.toBeInTheDocument();
        });
    });

    it('shows spinner after confirming reset, then displays success modal for resetExcludeGroup', async () => {
        (resetExcludeGroup as any).mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => resolve({ resultCode: 'SUCCESS' }), 500);
            })
        );

        render(<Actions groupingPath={shortGroupingPath} />);
        const user = userEvent.setup();
        const excludeCheckbox = screen.getByRole('checkbox', { name: /reset exclude/i });

        await user.click(excludeCheckbox);
        await waitFor(() => {
            expect(excludeCheckbox).toBeChecked();
        });

        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        await user.click(resetBtn);

        const modal = await screen.findByRole('alertdialog', { name: /reset grouping/i });
        expect(modal).toBeInTheDocument();
        expect(modal).toHaveTextContent(/exclude list/i);
        expect(modal).toHaveTextContent(/groupName/i);

        const yesButton = screen.getByText('Yes');
        await user.click(yesButton);

        await waitFor(() => {
            expect(screen.queryByRole('alertdialog', { name: /reset grouping/i })).not.toBeInTheDocument();
        });

        const spinnerContainer = document.querySelector('#loading-spinner');
        expect(spinnerContainer).not.toBeNull();

        await waitFor(() => {
            expect(resetExcludeGroup).toHaveBeenCalledWith(decodeURIComponent(shortGroupingPath));
        });

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        const successModal = await screen.findByRole('alertdialog', { name: /grouping reset completion/i });
        expect(successModal).toBeInTheDocument();
        expect(successModal).toHaveTextContent('The Exclude list has successfully been reset.');

        const okButton = screen.getByRole('button', { name: /ok/i });
        expect(okButton).toBeInTheDocument();
        await user.click(okButton);

        await waitFor(() => {
            expect(screen.queryByRole('alertdialog', { name: /grouping reset completion/i })).not.toBeInTheDocument();
        });
    });

    it('shows spinner after confirming reset, then displays success modal for resetExcludeGroupAsync', async () => {
        (resetExcludeGroupAsync as any).mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => resolve({ resultCode: 'SUCCESS' }), 500);
            })
        );

        render(<Actions groupingPath={longGroupingPath} />);
        const user = userEvent.setup();
        const excludeCheckbox = screen.getByRole('checkbox', { name: /reset exclude/i });

        await user.click(excludeCheckbox);
        await waitFor(() => {
            expect(excludeCheckbox).toBeChecked();
        });

        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        await user.click(resetBtn);

        const modal = await screen.findByRole('alertdialog', { name: /reset grouping/i });
        expect(modal).toBeInTheDocument();
        expect(modal).toHaveTextContent(/exclude list/i);
        expect(modal).toHaveTextContent(/groupNameLong/i);

        const yesButton = screen.getByText('Yes');
        await user.click(yesButton);

        await waitFor(() => {
            expect(screen.queryByRole('alertdialog', { name: /reset grouping/i })).not.toBeInTheDocument();
        });

        const spinnerContainer = document.querySelector('#loading-spinner');
        expect(spinnerContainer).not.toBeNull();

        await waitFor(() => {
            expect(resetExcludeGroupAsync).toHaveBeenCalledWith(decodeURIComponent(longGroupingPath));
        });

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        const successModal = await screen.findByRole('alertdialog', { name: /grouping reset completion/i });
        expect(successModal).toBeInTheDocument();
        expect(successModal).toHaveTextContent('The Exclude list has successfully been reset.');

        const okButton = screen.getByRole('button', { name: /ok/i });
        expect(okButton).toBeInTheDocument();
        await user.click(okButton);

        await waitFor(() => {
            expect(screen.queryByRole('alertdialog', { name: /grouping reset completion/i })).not.toBeInTheDocument();
        });
    });

    it('opens and closes the dynamic modal', async () => {
        render(<Actions groupingPath={shortGroupingPath} />);
        const user = userEvent.setup();
        const icon = screen.getByTestId('actions-tooltip-icon');
        await user.click(icon);
        const dynamicModal = await screen.findByRole('alertdialog', { name: /actions information/i });
        expect(dynamicModal).toBeInTheDocument();
        expect(dynamicModal).toHaveTextContent(
            'Reset the grouping by removing all of the members in the include or exclude or both.'
        );
        const okBtn = screen.getByRole('button', { name: /ok/i });
        await user.click(okBtn);
        await waitFor(() => {
            expect(screen.queryByRole('alertdialog', { name: /actions information/i })).not.toBeInTheDocument();
        });
    });


    it('submits the form and triggers preventDefault to prevent page reload', () => {
        render(<Actions groupingPath="test:group" />);
        const form = document.querySelector('form');

        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        submitEvent.preventDefault = vi.fn();

        form?.dispatchEvent(submitEvent);
        expect(submitEvent.preventDefault).toHaveBeenCalled();
    });

    it('shows spinner after confirming reset, then displays success modal for resetIncludeGroupAsync', async () => {
        (resetIncludeGroupAsync as any).mockImplementation(() =>
            Promise.resolve({ resultCode: 'SUCCESS' })
        );
        const longPath = 'test:' + 'b'.repeat(751) + ':groupNameLong';
        const encodedPath = encodeURIComponent(longPath);
        render(<Actions groupingPath={encodedPath} />);
        const user = userEvent.setup();
        const includeCheckbox = screen.getByRole('checkbox', { name: /reset include/i });
        expect(includeCheckbox).not.toBeChecked();
        await user.click(includeCheckbox);
        await waitFor(() => expect(includeCheckbox).toBeChecked());
        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        await user.click(resetBtn);
        const modal = await screen.findByRole('alertdialog', { name: /reset grouping/i });
        const yesButton = screen.getByText('Yes');
        await user.click(yesButton);
        await waitFor(() => {
            expect(resetIncludeGroupAsync).toHaveBeenCalledWith(decodeURIComponent(encodedPath));
        });
        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
        await waitFor(() => {
            expect(includeCheckbox).not.toBeChecked();
        });
        const successModal = await screen.findByRole('alertdialog', {
            name: /grouping reset completion/i
        });
        expect(successModal).toHaveTextContent('The Include list has successfully been reset.');
        const okButton = screen.getByRole('button', { name: /ok/i });
        await user.click(okButton);
        await waitFor(() => {
            expect(successModal).not.toBeInTheDocument();
        });
    });

    it('does not show success modal or call refresh if resetExcludeGroupAsync fails', async () => {
        const refreshMock = vi.fn();
        (resetExcludeGroupAsync as any).mockImplementation(() =>
            Promise.resolve({ resultCode: 'FAILURE' })
        );
        const longPath = 'test:' + 'fail'.repeat(200) + ':groupNameLong';
        render(<Actions groupingPath={encodeURIComponent(longPath)} />);
        const user = userEvent.setup();
        const excludeCheckbox = screen.getByRole('checkbox', { name: /reset exclude/i });
        await user.click(excludeCheckbox);
        await waitFor(() => {
            expect(excludeCheckbox).toBeChecked();
        });
        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        await user.click(resetBtn);
        const modal = await screen.findByRole('alertdialog', { name: /reset grouping/i });
        const yesButton = screen.getByText('Yes');
        await user.click(yesButton);
        await waitFor(() => {
            expect(resetExcludeGroupAsync).toHaveBeenCalledWith(longPath);
        });
        await waitFor(() => {
            expect(screen.queryByRole('alertdialog', { name: /grouping reset completion/i })).not.toBeInTheDocument();
        });
        expect(excludeCheckbox).toBeChecked();
        expect(refreshMock).not.toHaveBeenCalled();
    });

    it('does not show success modal or call refresh if resetIncludeGroup fails', async () => {
        (resetIncludeGroup as any).mockResolvedValue({ resultCode: 'FAILURE' });
        refreshMock.mockClear();
        render(<Actions groupingPath={shortGroupingPath} />);
        const user = userEvent.setup();
        const includeCheckbox = screen.getByRole('checkbox', { name: /reset include/i });
        await user.click(includeCheckbox);
        expect(includeCheckbox).toBeChecked();
        await user.click(screen.getByRole('button', { name: /reset selected/i }));
        await user.click(screen.getByText('Yes'));
        await waitFor(() =>
            expect(resetIncludeGroup).toHaveBeenCalledWith(decodeURIComponent(shortGroupingPath))
        );
        await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
        expect(screen.queryByRole('alertdialog', { name: /grouping reset completion/i })).toBeNull();
        expect(includeCheckbox).toBeChecked();
        expect(refreshMock).not.toHaveBeenCalled();
    });

});
