import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OwnersTab from '@/app/groupings/[groupingPath]/@tab/owners/page';

describe('OwnersTab', () => {
    it('renders Owners tab', () => {
        render(<OwnersTab />);
        const heading = screen.getByRole('heading', { name: /owners/i });
        expect(heading).toBeInTheDocument();
    });
});
