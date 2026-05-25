/**
 * Tests for the <Preferences /> client component.
 *
 * Component summary:
 *   - Renders two toggle switches: opt-in (allow self-add) and opt-out (allow self-remove).
 *   - Toggling a switch calls `updateOptIn` / `updateOptOut`. On a SUCCESS result
 *     the component updates its local state to `updatedStatus` and calls
 *     `router.refresh()` to revalidate server data.
 *   - Each switch has a question-mark info icon (testids `opt-in-info-icon` /
 *     `opt-out-info-icon`) that opens a dynamic modal with help text.
 *
 * Conventions:
 *   - `next/navigation` is mocked *before* imports because the component reads
 *     `useRouter` at module load. The shared `refreshMock` lets tests assert
 *     that the router was refreshed on successful updates.
 *   - `@/lib/actions` is auto-mocked; per-test return values use `vi.mocked(...)`.
 *   - `allowOptIn` / `allowOptOut` default to `false` in the component, so most
 *     tests omit them. Pass them explicitly when a test cares about initial state.
 */

// IMPORTANT: vi.mock is hoisted above imports. `refreshMock` is declared in this
// file's top scope so each test can assert against the same shared mock.
const refreshMock = vi.fn();

vi.mock('next/navigation', async () => {
    const actual = await vi.importActual<typeof import('next/navigation')>('next/navigation');
    return {
        ...actual,
        useRouter: () => ({
            refresh: refreshMock
        })
    };
});

import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Preferences from '@/app/groupings/[groupingPath]/@tab/_components/preference';
import { updateOptIn, updateOptOut } from '@/lib/actions';
import type { GroupingUpdateOptAttributeResult } from '@/lib/types';

vi.mock('@/lib/actions');

/**
 * Helper for building a minimal mock response. The component only reads
 * `resultCode` and `updatedStatus`, so other required fields are filled with
 * inert defaults to satisfy the full `GroupingUpdateOptAttributeResult` type.
 */
const mockOptResult = (
    overrides: Partial<GroupingUpdateOptAttributeResult> = {}
): GroupingUpdateOptAttributeResult => ({
    resultCode: 'SUCCESS',
    updatedStatus: true,
    name: 'mock',
    currentStatus: false,
    groupPath: 'mock:path',
    optInPrivilegeResult: { privilegeName: 'optin', privilegeValue: true },
    optOutPrivilegeResult: { privilegeName: 'optout', privilegeValue: true },
    ...overrides
});

// ResizeObserver shim for Radix UI primitives lives in tests/vitest.setup.tsx
// and is applied globally; no per-file install needed.

describe('Preferences Component', () => {
    // URL-encoded grouping path; the component decodes it before calling the API.
    const groupingPath = 'group%3Atest%3Apath';
    const decodedGroupingPath = 'group:test:path';

    beforeEach(() => {
        vi.clearAllMocks();
        // Default success responses for the happy path.
        vi.mocked(updateOptIn).mockResolvedValue(mockOptResult({ resultCode: 'SUCCESS', updatedStatus: true }));
        vi.mocked(updateOptOut).mockResolvedValue(mockOptResult({ resultCode: 'SUCCESS', updatedStatus: true }));
    });

    it('renders the title and description', () => {
        render(<Preferences groupingPath={groupingPath} />);
        expect(screen.getByText('Preferences')).toBeInTheDocument();
        expect(screen.getByText(/Changes made may not take effect immediately/i)).toBeInTheDocument();
    });

    it('toggles opt-in ON via the API and flips the switch on SUCCESS', async () => {
        render(<Preferences groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const optInSwitch = screen.getByLabelText(/allow people to add themselves/i);
        expect(optInSwitch).toHaveAttribute('aria-checked', 'false');

        await user.click(optInSwitch);

        await waitFor(() => {
            expect(updateOptIn).toHaveBeenCalledWith(decodedGroupingPath, true);
        });
        expect(optInSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles opt-out ON via the API and flips the switch on SUCCESS', async () => {
        render(<Preferences groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const optOutSwitch = screen.getByLabelText(/allow people to remove themselves/i);
        expect(optOutSwitch).toHaveAttribute('aria-checked', 'false');

        await user.click(optOutSwitch);

        await waitFor(() => {
            expect(updateOptOut).toHaveBeenCalledWith(decodedGroupingPath, true);
        });
        expect(optOutSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('opens the opt-in info modal when its question icon is clicked', async () => {
        render(<Preferences groupingPath={groupingPath} />);
        const user = userEvent.setup();

        await user.click(screen.getByTestId('opt-in-info-icon'));
        expect(await screen.findByText(/enable the opt-in self-service/i)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /ok/i }));
        await waitFor(() => {
            expect(screen.queryByText(/enable the opt-in self-service/i)).not.toBeInTheDocument();
        });
    });

    it('opens the opt-out info modal when its question icon is clicked', async () => {
        render(<Preferences groupingPath={groupingPath} />);
        const user = userEvent.setup();

        await user.click(screen.getByTestId('opt-out-info-icon'));
        expect(await screen.findByText(/enable the opt-out self-service/i)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /ok/i }));
        await waitFor(() => {
            expect(screen.queryByText(/enable the opt-out self-service/i)).not.toBeInTheDocument();
        });
    });

    it('prevents the default native form submit (no page reload)', () => {
        render(<Preferences groupingPath={groupingPath} />);

        const form = screen.getByTestId('preferences-form');
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        submitEvent.preventDefault = vi.fn();

        form.dispatchEvent(submitEvent);
        expect(submitEvent.preventDefault).toHaveBeenCalled();
    });

    it('calls router.refresh() and flips the switch when updateOptIn returns SUCCESS', async () => {
        render(<Preferences groupingPath={groupingPath} allowOptIn={false} allowOptOut={false} />);
        const user = userEvent.setup();
        const optInSwitch = screen.getByLabelText(/allow people to add themselves/i);
        expect(optInSwitch).toHaveAttribute('aria-checked', 'false');

        await user.click(optInSwitch);

        await waitFor(() => expect(updateOptIn).toHaveBeenCalledWith(decodedGroupingPath, true));
        await waitFor(() => expect(refreshMock).toHaveBeenCalled());
        expect(optInSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('does not refresh or change state when updateOptOut returns FAILURE', async () => {
        vi.mocked(updateOptOut).mockResolvedValue(mockOptResult({ resultCode: 'FAILURE', updatedStatus: false }));
        render(<Preferences groupingPath={groupingPath} allowOptIn={false} allowOptOut={false} />);
        const user = userEvent.setup();
        const optOutSwitch = screen.getByLabelText(/allow people to remove themselves/i);
        expect(optOutSwitch).toHaveAttribute('aria-checked', 'false');

        await user.click(optOutSwitch);

        await waitFor(() => expect(updateOptOut).toHaveBeenCalled());
        expect(optOutSwitch).toHaveAttribute('aria-checked', 'false');
        expect(refreshMock).not.toHaveBeenCalled();
    });

    it('does not refresh or change state when updateOptIn returns FAILURE', async () => {
        vi.mocked(updateOptIn).mockResolvedValue(mockOptResult({ resultCode: 'FAILURE', updatedStatus: false }));
        render(<Preferences groupingPath={groupingPath} allowOptIn={false} allowOptOut={false} />);
        const user = userEvent.setup();
        const optInSwitch = screen.getByLabelText(/allow people to add themselves/i);
        expect(optInSwitch).toHaveAttribute('aria-checked', 'false');

        await user.click(optInSwitch);

        await waitFor(() => expect(updateOptIn).toHaveBeenCalled());
        expect(optInSwitch).toHaveAttribute('aria-checked', 'false');
        expect(refreshMock).not.toHaveBeenCalled();
    });

});
