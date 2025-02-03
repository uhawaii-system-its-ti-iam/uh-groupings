import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PreferencesTab from '@/app/groupings/[groupingPath]/@tab/preferences/page';

describe('PreferencesTab', () => {
    it('renders Preferences tab', () => {
        render(<PreferencesTab />);
        const heading = screen.getByRole('heading', { name: /preferences/i });
        expect(heading).toBeInTheDocument();
    });
});
