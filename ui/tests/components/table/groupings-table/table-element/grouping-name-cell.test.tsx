import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GroupingNameCell from '@/components/table/groupings-table/table-element/grouping-name-cell';

describe('GroupingNameCell', () => {
    it('renders the link with the correct path and displays the name', () => {
        const path = 'test-path';
        const name = 'Test Name';
        render(<GroupingNameCell path={path} name={name} />);
        expect(screen.getByText(name)).toBeInTheDocument();
        expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', `/groupings/${path}/all-members`);
    });
});
