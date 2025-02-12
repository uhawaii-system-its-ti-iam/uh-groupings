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

        // 点击 Include 开关
        const includeSwitch = screen.getByRole('switch', { name: /reset include/i });
        await user.click(includeSwitch);

        // 检查开关状态更新
        await waitFor(() => {
            expect(includeSwitch).toHaveAttribute('aria-checked', 'true');
        });

        // 点击 Reset Selected 按钮
        const resetBtn = screen.getByRole('button', { name: /reset selected/i });
        await user.click(resetBtn);

        // 检查 Modal 是否打开
        const modal = await screen.findByRole('alertdialog', { name: /reset grouping/i });
        expect(modal).toBeInTheDocument();
        expect(modal).toHaveTextContent(/include list/i);
        expect(modal).toHaveTextContent(/groupName/i);

        // 点击 Modal 中的 Yes 按钮
        const yesButtons = screen.getAllByRole('button', { name: /yes/i });
        await user.click(yesButtons[0]);

        // 检查 Modal 是否关闭
        await waitFor(() => {
            expect(screen.queryByRole('alertdialog', { name: /reset grouping/i })).not.toBeInTheDocument();
        });

        // 检查 resetIncludeGroup 是否被正确调用
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