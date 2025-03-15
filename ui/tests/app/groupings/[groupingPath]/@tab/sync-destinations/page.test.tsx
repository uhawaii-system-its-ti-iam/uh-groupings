import { describe, it, vi, expect, beforeEach, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SyncDestinations from '@/app/groupings/[groupingPath]/@tab/sync-destinations/sync-destinations';
import { updateSyncDest } from '@/lib/actions';

vi.mock('@/lib/actions');

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

describe('SyncDestinations Component', () => {
    const syncDestArray = [
        {
            syncDestId: 'g1',
            description: 'Google Groups',
            tooltip: 'Syncs with Google',
            synced: true,
            hidden: false,
        },
        {
            syncDestId: 'ldap1',
            description: 'LDAP',
            tooltip: 'Syncs with LDAP',
            synced: false,
            hidden: false,
        },
        {
            syncDestId: 'h1',
            description: 'Hidden Group',
            tooltip: 'Should not be shown',
            synced: true,
            hidden: true,
        },
    ];
    const groupingPath = 'group%3Atest%3Apath';

    beforeEach(() => {
        vi.clearAllMocks();
        (updateSyncDest as any).mockResolvedValue({ resultCode: 'SUCCESS' });
    });

    it('renders title and explanation text', () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        expect(screen.getByText('Synchronization Destinations')).toBeInTheDocument();
        expect(screen.getByText(/Changes made may not take effect immediately/i)).toBeInTheDocument();
    });

    it('renders all non-hidden sync destinations with switches and tooltips', () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        expect(screen.getByLabelText('Google Groups')).toBeInTheDocument();
        expect(screen.getByLabelText('LDAP')).toBeInTheDocument();
        expect(screen.queryByLabelText('Hidden Group')).not.toBeInTheDocument();
    });

    it('opens confirmation modal when switch is toggled', async () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const ldapSwitch = screen.getByLabelText('LDAP');
        await user.click(ldapSwitch);
        const confirmText = await screen.findByText(/Are you sure you want to enable/i);
        expect(confirmText).toBeInTheDocument();
    });

    it('calls updateSyncDest and updates UI after confirming switch', async () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const ldapSwitch = screen.getByLabelText('LDAP');

        await user.click(ldapSwitch);
        const confirmButton = await screen.findByText('Yes');
        await user.click(confirmButton);

        await waitFor(() => {
            expect(updateSyncDest).toHaveBeenCalledWith('group:test:path', 'ldap1', true);
        });

        expect(await screen.findByLabelText('LDAP')).toHaveAttribute('aria-checked', 'true');
    });

    it('shows dynamic modal with tooltip when question icon clicked', async () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const icon = screen.getByTestId('info-icon-g1');
        await user.click(icon);
        expect(await screen.findByText('Syncs with Google')).toBeInTheDocument();
        const okBtn = screen.getByRole('button', { name: /ok/i });
        await user.click(okBtn);
        await waitFor(() => {
            expect(screen.queryByText('Syncs with Google')).not.toBeInTheDocument();
        });
    });
});
