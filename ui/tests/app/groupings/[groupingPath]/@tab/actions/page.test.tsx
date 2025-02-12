import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActionsTab from '@/app/groupings/[groupingPath]/@tab/actions/page';

vi.mock('@/app/groupings/[groupingPath]/@tab/_components/grouping-actions', () => ({
    __esModule: true,
    default: ({ groupingPath }: { groupingPath: string }) => (
        <div>Mocked Actions Component: {groupingPath}</div>
    ),
}));

describe('ActionsTab (Server Component)', () => {
    it('renders Actions component with correct groupingPath', async () => {
        const params = { groupingPath: 'test%3Agroup' };
        render(<ActionsTab params={params} />);
        expect(await screen.findByText('Mocked Actions Component: test%3Agroup')).toBeInTheDocument();
    });
});
