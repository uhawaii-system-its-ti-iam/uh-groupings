import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BasisTab from '@/app/groupings/[groupingPath]/@tab/basis/page';

describe('BasisTab', () => {
    it('renders Basis tab', () => {
        render(<BasisTab />);
        const heading = screen.getByRole('heading', { name: /basis members/i });
        expect(heading).toBeInTheDocument();
    });
});
