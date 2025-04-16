import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import SyncDestinationsTab from '@/app/groupings/[groupingPath]/@tab/sync-destinations/page';
import { groupingSyncDest } from '@/lib/fetchers';

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

vi.mock('@/lib/fetchers', () => ({
    groupingSyncDest: vi.fn(),
}));

vi.mock('@/app/groupings/[groupingPath]/@tab/_components/sync-destinations', () => ({
    default: ({ syncDestArray, groupingPath }: any) => (
        <div>
            <div>Mocked SyncDestinations Component</div>
            <div>groupingPath: {groupingPath}</div>
            <div>syncDestCount: {syncDestArray.length}</div>
        </div>
    ),
}));

describe('SyncDestinationsTab (Server Component)', () => {
    it('calls groupingSyncDest and renders SyncDestinations with processed props', async () => {
        const mockData = {
            syncDestinations: [
                {
                    name: 'dest1',
                    description: 'Description 1',
                    synced: true,
                    hidden: false,
                    tooltip: 'Tooltip 1',
                },
                {
                    name: 'dest2',
                    description: 'Description 2',
                    synced: false,
                    hidden: true,
                    tooltip: 'Tooltip 2',
                },
            ],
        };
        (groupingSyncDest as unknown as vi.Mock).mockResolvedValue(mockData);
        const result = await SyncDestinationsTab({ params: { groupingPath: 'test:group' } });
        render(result);

        expect(await screen.findByText('Mocked SyncDestinations Component')).toBeInTheDocument();
        expect(screen.getByText('groupingPath: test:group')).toBeInTheDocument();
        expect(screen.getByText('syncDestCount: 2')).toBeInTheDocument();
        expect(groupingSyncDest).toHaveBeenCalledWith('test:group');
    });
});
