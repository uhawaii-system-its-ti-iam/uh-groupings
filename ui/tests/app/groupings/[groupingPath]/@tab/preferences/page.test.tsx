import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import PreferenceTab from '@/app/groupings/[groupingPath]/@tab/preferences/page';

vi.mock('@/app/groupings/[groupingPath]/@tab/_components/preference', () => ({
    __esModule: true,
    default: ({ groupingPath }: { groupingPath: string }) => (
        <div>Mocked Preference Component: {groupingPath}</div>
    ),
}));

vi.mock('@/lib/fetchers', () => ({
    groupingOptAttributes: vi.fn(() =>
        Promise.resolve({ optInOn: true, optOutOn: false })
    ),
}));

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

describe('PreferenceTab (Server Component)', () => {
    it('renders Preference component with correct groupingPath', async () => {
        const params = { groupingPath: 'test%3Agroup' };
        const ui = await PreferenceTab({ params });
        render(ui);
        expect(await screen.findByText('Mocked Preference Component: test%3Agroup')).toBeInTheDocument();
    });
});
