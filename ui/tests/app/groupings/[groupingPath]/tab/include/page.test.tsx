import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import IncludeTab from '@/app/groupings/[groupingPath]/@tab/include/page';

describe('IncludeTab', () => {
    it('renders Include tab', () => {
        render(<IncludeTab />);
        const heading = screen.getByRole('heading', { name: /include/i });
        expect(heading).toBeInTheDocument();
    });
});
