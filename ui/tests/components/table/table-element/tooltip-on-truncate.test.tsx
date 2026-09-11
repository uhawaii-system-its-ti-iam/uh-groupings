import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TooltipOnTruncate from '@/components/table/table-element/tooltip-on-truncate';

describe('TooltipOnTruncate component', () => {
    it('renders child content', () => {
        render(
            <TooltipOnTruncate value="Truncated Text">
                <button>Truncated Text</button>
            </TooltipOnTruncate>
        );
        expect(screen.getByRole('button', { name: 'Truncated Text' })).toBeInTheDocument();
    });

    it('should not show tooltip if content is not truncated', async () => {
        render(
            <TooltipOnTruncate value="Truncated Text">
                <button>Truncated Text</button>
            </TooltipOnTruncate>
        );
        const button = screen.getByRole('button');
        Object.defineProperty(button, 'scrollWidth', { configurable: true, value: 30 });
        Object.defineProperty(button, 'clientWidth', { configurable: true, value: 500 });
        fireEvent(window, new Event('resize'));

        await waitFor(() => {
            expect(screen.queryByTestId('tooltip-on-truncate')).not.toBeInTheDocument();
        });
    });
});
