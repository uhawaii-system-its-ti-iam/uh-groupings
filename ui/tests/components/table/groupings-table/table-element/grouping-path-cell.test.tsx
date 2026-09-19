import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GroupingPathCell from '@/components/table/groupings-table/table-element/grouping-path-cell';

describe('GroupingPathCell', () => {
    const path = 'tmp:example:example-aux';

    it('renders the component with correct data and clipboard button', () => {
        render(<GroupingPathCell path={path} />);

        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveValue(path);

        const clipboardButton = screen.getByRole('button');
        expect(clipboardButton).toBeInTheDocument();
        expect(screen.getByTestId('clipboard-icon')).toBeInTheDocument();
    });

    it('renders clipboard interaction button', () => {
        render(<GroupingPathCell path={path} />);
        const clipboardButton = screen.getByRole('button');
        expect(clipboardButton).toHaveAttribute('data-testid', 'clipboard-button');
    });

    it('renders path input inside tooltip wrapper', () => {
        render(<GroupingPathCell path={path} />);
        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveValue(path);
    });
});
