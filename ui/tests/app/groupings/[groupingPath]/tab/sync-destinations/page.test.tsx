import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SyncDestinationsTab from '@/app/groupings/[groupingPath]/@tab/sync-destinations/page';

describe('SyncDestinationsTab', () => {
    it('renders SyncDestinations tab', () => {
        render(<SyncDestinationsTab />);
        const heading = screen.getByRole('heading', { name: /synchronization destinations/i });
        expect(heading).toBeInTheDocument();
    });
});
