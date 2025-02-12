import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import PreferenceTab from '@/app/groupings/[groupingPath]/@tab/preferences/page';

beforeAll(() => {
    if (typeof global.ResizeObserver === 'undefined') {
        class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        }
        global.ResizeObserver = ResizeObserver;
    }
});

vi.mock('@/app/groupings/[groupingPath]/@tab/preferences/preference', () => ({
    default: ({ groupingPath }: { groupingPath: string }) => (
        <div>Mocked Preference Component: {groupingPath}</div>
    ),
}));

describe('PreferenceTab (Server Component)', () => {
    it('renders Preference component with correct groupingPath', () => {
        const params = { groupingPath: 'test:group' };
        render(<PreferenceTab params={params} />);
        expect(screen.getByText('Mocked Preference Component: test:group')).toBeInTheDocument();
    });
});
