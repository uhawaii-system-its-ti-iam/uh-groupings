import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActionsTab from '@/app/groupings/[groupingPath]/@tab/actions/page';

describe('ActionsTab', () => {
    it('renders Actions tab', () => {
        render(<ActionsTab />);
        const heading = screen.getByRole('heading', { name: /actions/i });
        expect(heading).toBeInTheDocument();
    });
});
