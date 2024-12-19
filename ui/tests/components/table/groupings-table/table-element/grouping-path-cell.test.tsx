import { vi, describe, it, expect } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import GroupingPathCell from '@/components/table/groupings-table/table-element/grouping-path-cell';
import userEvent from '@testing-library/user-event';

describe('GroupingPathCell', () => {
    const path = 'tmp:example:example-aux';

    it('renders the component with correct data and clipboard button', async () => {
        render(<GroupingPathCell path={path} />);

        const user = userEvent.setup();
        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveValue(path);

        const clipboardButton = screen.getByRole('button');
        expect(clipboardButton).toBeInTheDocument();
        expect(screen.getByTestId('clipboard-icon')).toBeInTheDocument();

        await waitFor(
            async () => {
                await user.hover(clipboardButton);
                expect(screen.getAllByText('copy')[0]).toBeInTheDocument();
            },
            { timeout: 3000 }
        );
    });

    it('shows tooltip correctly when copying to clipboard', async () => {
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: vi.fn(() => Promise.resolve())
            },
            writable: true
        });
        vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => Promise.resolve());

        render(<GroupingPathCell path={path} />);
        const clipboardButton = screen.getByRole('button');

        // Verify clipboard action and tooltip appearance
        fireEvent.click(clipboardButton);
        await waitFor(() => {
            expect(screen.getAllByText('copied!')[0]).toBeInTheDocument();
        });

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(path);

        // Wait for the 'copied!' text to disappear
        await waitFor(
            () => {
                expect(screen.queryByText('copied!')).not.toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        // Check the 'copy' text appears again
        await waitFor(async () => {
            await userEvent.hover(clipboardButton);
        });

        await waitFor(
            () => {
                expect(screen.getAllByText('copy')[0]).toBeInTheDocument();
            },
            { timeout: 2000 }
        );
    });

    it('should show tooltip if content is truncated', async () => {
        Object.defineProperties(HTMLElement.prototype, {
            scrollWidth: { get: () => 500, configurable: true },
            clientWidth: { get: () => 30, configurable: true }
        });
        render(<GroupingPathCell path={path} />);

        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveValue(path);

        await waitFor(async () => {
            await userEvent.hover(inputElement);
        });

        // Wait for the tooltip to appear
        await waitFor(() => {
            expect(screen.getAllByTestId('tooltip-on-truncate')[0]).toBeInTheDocument();
        });
    });
});
