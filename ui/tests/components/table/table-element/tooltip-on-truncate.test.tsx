import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TooltipOnTruncate from '@/components/table/table-element/tooltip-on-truncate';

describe('TooltipOnTruncate component', () => {
    it('should show tooltip if content is truncated', async () => {
        Object.defineProperties(HTMLElement.prototype, {
            scrollWidth: { get: () => 500, configurable: true },
            clientWidth: { get: () => 30, configurable: true }
        });
        render(
            <TooltipOnTruncate value="Truncated Text">
                <button>Truncated Text</button>
            </TooltipOnTruncate>
        );
        const button = screen.getByRole('button');
        await waitFor(async () => {
            await userEvent.hover(button);
        });

        // Wait for the tooltip to appear
        await waitFor(() => {
            expect(screen.getAllByTestId('tooltip-on-truncate')[0]).toBeInTheDocument();
        });
    });

    it('should not show tooltip if content is not truncated', async () => {
        Object.defineProperties(HTMLElement.prototype, {
            scrollWidth: { get: () => 30, configurable: true },
            clientWidth: { get: () => 500, configurable: true }
        });
        render(
            <TooltipOnTruncate value="Truncated Text">
                <button>Truncated Text</button>
            </TooltipOnTruncate>
        );
        const button = screen.getByRole('button');

        await waitFor(async () => {
            await userEvent.hover(button);
        });

        await waitFor(() => {
            expect(screen.queryByTestId('tooltip-on-truncate')).not.toBeInTheDocument();
        });
    });
});
