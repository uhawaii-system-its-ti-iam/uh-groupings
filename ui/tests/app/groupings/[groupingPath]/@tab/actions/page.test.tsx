import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Actions from '@/app/groupings/[groupingPath]/@tab/actions/action';
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

    it('enables Reset Selected button when include switch is toggled', async () => {
        render(<Actions groupingPath={shortGroupingPath} />);
        const user = userEvent.setup();
        const includeSwitch = screen.getByRole('switch', { name: /reset include/i });
        await user.click(includeSwitch);
        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        expect(resetBtn).toBeEnabled();
    });

    it('enables Reset Selected button when exclude switch is toggled', async () => {
        render(<Actions groupingPath={shortGroupingPath} />);
        const user = userEvent.setup();

        const excludeSwitch = screen.getByRole('switch', { name: /reset exclude/i });
        await user.click(excludeSwitch);

        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        expect(resetBtn).toBeEnabled();
    });

    it('opens reset modal with correct message when only include switch is toggled (short path) and confirms', async () => {
        (resetIncludeGroup as any).mockResolvedValue({
            resultCode: 'SUCCESS'
        });
        render(<Actions groupingPath={shortGroupingPath} />);
        const user = userEvent.setup();
        const includeSwitch = screen.getByRole('switch', { name: /reset include/i });
        await user.click(includeSwitch);
        await waitFor(() => {
            expect(includeSwitch).toHaveAttribute('aria-checked', 'true');
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
        await waitFor(() => {
            expect(resetIncludeGroup).toHaveBeenCalledWith(decodeURIComponent(shortGroupingPath));
        }, { timeout: 4000 });
    });

    it('opens and closes the dynamic modal', async () => {
        render(<Actions groupingPath={shortGroupingPath} />);
        const user = userEvent.setup();
        const icon = document.querySelector('.w-6.h-6');
        expect(icon).toBeInTheDocument();
        await user.click(icon!.parentElement!);
        const dynamicModal = await screen.findByRole('alertdialog', { name: /actions information/i });
        expect(dynamicModal).toBeInTheDocument();
        expect(dynamicModal).toHaveTextContent('Reset the grouping by removing all of the members in the include or exclude or both.');
        const okBtn = screen.getByRole('button', { name: /ok/i });
        await user.click(okBtn);
        await waitFor(() => {
            expect(screen.queryByRole('alertdialog', { name: /actions information/i })).not.toBeInTheDocument();
        });
    });
});