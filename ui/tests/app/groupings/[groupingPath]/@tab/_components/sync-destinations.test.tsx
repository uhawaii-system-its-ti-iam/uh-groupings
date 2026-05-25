/**
 * Tests for the <SyncDestinations /> client component.
 *
 * Component summary:
 *   - Renders a list of toggle switches, one per non-hidden sync destination.
 *   - Clicking a switch opens a confirmation modal; clicking "Yes" calls
 *     `updateSyncDest(decodedPath, name, newSyncedState)` and (on SUCCESS)
 *     refreshes the router and flips the local switch state.
 *   - Each row has a question-mark info icon that opens a dynamic modal
 *     displaying the destination's tooltip text.
 *
 * Conventions used here (mirror them when adding tests):
 *   1. Mocks for `next/navigation` are declared before imports because Vitest
 *      hoists `vi.mock` calls and the component reads `useRouter` at import time.
 *   2. The action module is auto-mocked with `vi.mock('@/lib/actions')`. Use
 *      `vi.mocked(updateSyncDest)` (no `as any`) to set per-test return values.
 *   3. ResizeObserver is shimmed globally in `tests/vitest.setup.tsx` because
 *      Radix UI primitives (Switch/Tooltip/Modal) require it and jsdom doesn't ship one.
 *   4. Prefer accessible queries: `getByLabelText` for switches (the label and
 *      switch are wired via `aria-labelledby`), `getByRole('alertdialog', ...)`
 *      for modals, and `getByTestId('info-icon-<name>')` for the question icons.
 */

// IMPORTANT: vi.mock calls are hoisted, so this must run before the component
// imports `useRouter`. Keep this block at the very top of the file.
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn()
    })
}));

import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SyncDestinations from '@/app/groupings/[groupingPath]/@tab/_components/sync-destinations';
import { updateSyncDest } from '@/lib/actions';
import type { GroupingSyncDestination, GroupingUpdatedAttributeResult } from '@/lib/types';

// Auto-mock the actions module so every exported function becomes a vi.fn().
// Per-test return values are configured via `vi.mocked(updateSyncDest).mockResolvedValue(...)`.
vi.mock('@/lib/actions');

/**
 * Helper for building a minimal mock response. The component only reads
 * `resultCode` from the result, so we widen everything else with sensible
 * defaults to satisfy the full `GroupingUpdatedAttributeResult` type.
 */
const mockUpdateResult = (
    overrides: Partial<GroupingUpdatedAttributeResult> = {}
): GroupingUpdatedAttributeResult => ({
    resultCode: 'SUCCESS',
    name: 'mock',
    updatedStatus: true,
    currentStatus: false,
    groupPath: 'mock:path',
    ...overrides
});


describe('SyncDestinations Component', () => {
    // Fixture: two visible destinations (one already synced, one not) and one
    // hidden destination that must NOT render. Keep this representative — most
    // tests reuse it.
    const syncDestArray: GroupingSyncDestination[] = [
        { name: 'g1', description: 'Google Groups', tooltip: 'Syncs with Google', synced: true, hidden: false },
        { name: 'ldap1', description: 'LDAP', tooltip: 'Syncs with LDAP', synced: false, hidden: false },
        { name: 'h1', description: 'Hidden Group', tooltip: 'Should not be shown', synced: true, hidden: true }
    ];
    // URL-encoded grouping path; the component decodes it before calling the API.
    const groupingPath = 'group%3Atest%3Apath';
    const decodedGroupingPath = 'group:test:path';

    beforeEach(() => {
        vi.clearAllMocks();
        // Default success response so tests that don't override it still drive
        // the happy-path UI updates.
        vi.mocked(updateSyncDest).mockResolvedValue(mockUpdateResult({ resultCode: 'SUCCESS' }));
    });

    it('renders title and explanation text', () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        expect(screen.getByText('Synchronization Destinations')).toBeInTheDocument();
        expect(screen.getByText(/Changes made may not take effect immediately/i)).toBeInTheDocument();
    });

    it('renders all non-hidden sync destinations and omits hidden ones', () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        expect(screen.getByLabelText('Google Groups')).toBeInTheDocument();
        expect(screen.getByLabelText('LDAP')).toBeInTheDocument();
        expect(screen.queryByLabelText('Hidden Group')).not.toBeInTheDocument();
    });

    it('opens the confirmation modal when a switch is toggled', async () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();

        await user.click(screen.getByLabelText('LDAP'));

        expect(await screen.findByText(/Are you sure you want to enable/i)).toBeInTheDocument();
    });

    it('calls updateSyncDest and flips the switch after confirming (false → true)', async () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();

        await user.click(screen.getByLabelText('LDAP'));
        await user.click(await screen.findByText('Yes'));

        await waitFor(() => {
            expect(updateSyncDest).toHaveBeenCalledWith(decodedGroupingPath, 'ldap1', true);
        });
        expect(await screen.findByLabelText('LDAP')).toHaveAttribute('aria-checked', 'true');
    });

    it('opens the dynamic info modal with the tooltip when the question icon is clicked', async () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();

        await user.click(screen.getByTestId('info-icon-g1'));
        expect(await screen.findByText('Syncs with Google')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /OK/i }));
        await waitFor(() => {
            expect(screen.queryByText('Syncs with Google')).not.toBeInTheDocument();
        });
    });

    it('prevents the default native form submit (no page reload)', () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        // The form's only purpose is to host the switches; submission must be
        // suppressed by its inline onSubmit. We dispatch a real submit event on
        // the form element (located via testid for accessibility-friendly lookup)
        // and assert preventDefault was invoked.
        const form = screen.getByTestId('sync-destinations-form');
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        submitEvent.preventDefault = vi.fn();
        form.dispatchEvent(submitEvent);
        expect(submitEvent.preventDefault).toHaveBeenCalled();
    });

    it('opens the confirmation modal when a synced destination is toggled OFF (true → false)', async () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const googleSwitch = screen.getByLabelText('Google Groups');
        expect(googleSwitch).toHaveAttribute('aria-checked', 'true');

        await user.click(googleSwitch);

        expect(
            await screen.findByText(/Are you sure you want to disable the synchronization destination: Google Groups\?/i)
        ).toBeInTheDocument();

        await user.click(screen.getByText('Yes'));

        await waitFor(() => {
            expect(updateSyncDest).toHaveBeenCalledWith(decodedGroupingPath, 'g1', false);
        });
        expect(await screen.findByLabelText('Google Groups')).toHaveAttribute('aria-checked', 'false');
    });

    it('preserves the switch state when the confirmation modal is canceled', async () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const googleSwitch = screen.getByLabelText('Google Groups');

        await user.click(googleSwitch);
        expect(await screen.findByText(/Are you sure you want to disable/i)).toBeInTheDocument();

        await user.click(screen.getByText(/cancel/i));

        await waitFor(() => {
            expect(screen.queryByText(/Are you sure you want to disable/i)).not.toBeInTheDocument();
        });
        expect(updateSyncDest).not.toHaveBeenCalled();
        expect(googleSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('does not flip the switch when the API returns a non-SUCCESS resultCode', async () => {
        vi.mocked(updateSyncDest).mockResolvedValue(mockUpdateResult({ resultCode: 'FAIL' }));
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const ldapSwitch = screen.getByLabelText('LDAP');
        expect(ldapSwitch).toHaveAttribute('aria-checked', 'false');

        await user.click(ldapSwitch);
        await user.click(await screen.findByText('Yes'));

        await waitFor(() => {
            expect(updateSyncDest).toHaveBeenCalledWith(decodedGroupingPath, 'ldap1', true);
        });
        // Switch must remain in its original off state when the API fails.
        expect(ldapSwitch).toHaveAttribute('aria-checked', 'false');
    });

    it('opens the dynamic info modal with an empty body when the destination has no tooltip', async () => {
        const noTooltipArray: GroupingSyncDestination[] = [
            { name: 'no-tip', description: 'NoTooltipDest', tooltip: '', synced: false, hidden: false }
        ];
        render(<SyncDestinations syncDestArray={noTooltipArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();

        await user.click(screen.getByTestId('info-icon-no-tip'));

        const modal = await screen.findByRole('alertdialog', { name: /sync destinations information/i });
        expect(modal).toBeInTheDocument();
        // Sanity check: no stale tooltip text leaked into the modal body.
        expect(screen.queryByText('Hello tooltip')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /OK/i }));
        await waitFor(() => {
            expect(
                screen.queryByRole('dialog', { name: /sync destinations information/i })
            ).not.toBeInTheDocument();
        });
    });

});
