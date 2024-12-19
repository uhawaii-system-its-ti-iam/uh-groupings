import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExportDropdown from '@/app/groupings/[groupingPath]/_components/export-dropdown';

describe('ExportDropdown', () => {
    it('renders button', () => {
        render(<ExportDropdown />);

        const buttonElement = screen.getByRole('button', { name: /Export Grouping/i });
        expect(buttonElement).toBeInTheDocument();
    });
});
