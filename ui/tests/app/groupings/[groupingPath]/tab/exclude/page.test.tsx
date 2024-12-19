import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExcludeTab from '@/app/groupings/[groupingPath]/@tab/exclude/page';

describe('ExcludeTab', () => {
    it('renders Exclude tab', () => {
        render(<ExcludeTab />);
        const heading = screen.getByRole('heading', { name: /exclude/i });
        expect(heading).toBeInTheDocument();
    });
});
