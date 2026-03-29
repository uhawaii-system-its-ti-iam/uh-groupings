import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/app/groupings/[groupingPath]/@tab/_components/grouping-actions', () => ({
    __esModule: true,
    default: ({ groupingPath }: { groupingPath: string }) => (
        <div>Mocked Actions Component: {groupingPath}</div>
    ),
}));

vi.mock('./utils', () => ({
    getDuplicateOwnersData: vi.fn().mockResolvedValue({
        duplicateOwners: {},
        duplicateOwnersCount: 0,
    }),
}));

describe('ActionsTab (Server Component)', () => {
    it('renders Actions component with correct groupingPath', async () => {
        // Import inside test to avoid initialization issues
        const { default: ActionsTab } = await import('@/app/groupings/[groupingPath]/@tab/actions/page');
        const params = { groupingPath: 'test%3Agroup' };

        const component = await ActionsTab({ params });
        render(component);

        expect(await screen.findByText('Mocked Actions Component: test%3Agroup')).toBeInTheDocument();
    });
});
