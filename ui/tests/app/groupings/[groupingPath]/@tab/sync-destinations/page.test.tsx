/**
 * Tests for the SyncDestinationsTab server component.
 *
 * What this verifies:
 *   - The server component calls `groupingSyncDest(groupingPath)` to fetch data.
 *   - It forwards the resolved `syncDestinations` array (length and contents)
 *     plus the original `groupingPath` to the client-side <SyncDestinations /> component.
 *
 * Why we mock `<SyncDestinations />`:
 *   The child is a client component with its own behavior and providers (tooltips,
 *   modals, etc.). For this test we only care about the *contract* between the
 *   server component and its child, so we stub the child with a minimal element
 *   that echoes the props we want to assert on.
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SyncDestinationsTab from '@/app/groupings/[groupingPath]/@tab/sync-destinations/page';
import { groupingSyncDest } from '@/lib/fetchers';
import type { GroupingSyncDestination } from '@/lib/types';

// ResizeObserver shim for Radix UI primitives lives in tests/vitest.setup.tsx
// and is applied globally; no per-file install needed.

vi.mock('@/lib/fetchers', () => ({
    groupingSyncDest: vi.fn()
}));

// Stub the child client component so this test focuses on the server component
// contract (which props are passed through) rather than child rendering details.
vi.mock('@/app/groupings/[groupingPath]/@tab/_components/sync-destinations', () => ({
    default: ({
        syncDestArray,
        groupingPath
    }: {
        syncDestArray: GroupingSyncDestination[];
        groupingPath: string;
    }) => (
        <div>
            <div>Mocked SyncDestinations Component</div>
            <div>groupingPath: {groupingPath}</div>
            <div>syncDestCount: {syncDestArray.length}</div>
        </div>
    )
}));

describe('SyncDestinationsTab (Server Component)', () => {
    it('calls groupingSyncDest and forwards syncDestinations + groupingPath to the child', async () => {
        const mockData = {
            resultCode: 'SUCCESS',
            syncDestinations: [
                { name: 'dest1', description: 'Description 1', synced: true, hidden: false, tooltip: 'Tooltip 1' },
                { name: 'dest2', description: 'Description 2', synced: false, hidden: true, tooltip: 'Tooltip 2' }
            ]
        };
        vi.mocked(groupingSyncDest).mockResolvedValue(mockData);

        // Server components return a React element; render it directly for assertions.
        const result = await SyncDestinationsTab({ params: { groupingPath: 'test:group' } });
        render(result);

        expect(await screen.findByText('Mocked SyncDestinations Component')).toBeInTheDocument();
        expect(screen.getByText('groupingPath: test:group')).toBeInTheDocument();
        expect(screen.getByText('syncDestCount: 2')).toBeInTheDocument();
        expect(groupingSyncDest).toHaveBeenCalledWith('test:group');
    });
});
