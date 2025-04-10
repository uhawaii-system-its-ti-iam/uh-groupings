vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn(),
    }),
}));

import { describe, it, vi, expect, beforeEach, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SyncDestinations from '@/app/groupings/[groupingPath]/@tab/_components/sync-destinations';
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
            name: 'g1',
            description: 'Google Groups',
            tooltip: 'Syncs with Google',
            synced: true,
            hidden: false,
        },
        {
            name: 'ldap1',
            description: 'LDAP',
            tooltip: 'Syncs with LDAP',
            synced: false,
            hidden: false,
        },
        {
            name: 'h1',
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

    it('calls updateSyncDest and updates UI after confirming switch (false -> true)', async () => {
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
        const okBtn = screen.getByRole('button', { name: /Cancel/i });
        await user.click(okBtn);
        await waitFor(() => {
            expect(screen.queryByText('Syncs with Google')).not.toBeInTheDocument();
        });
    });

    it('submits form and triggers preventDefault to prevent page reload', () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const form = document.querySelector('form');
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        submitEvent.preventDefault = vi.fn();
        form?.dispatchEvent(submitEvent);
        expect(submitEvent.preventDefault).toHaveBeenCalled();
    });

    it('opens confirmation modal when a synced destination is toggled OFF (true -> false) and updates UI after confirm', async () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const googleSwitch = screen.getByLabelText('Google Groups');
        expect(googleSwitch).toHaveAttribute('aria-checked', 'true');
        await user.click(googleSwitch);
        const confirmText = await screen.findByText(/Are you sure you want to disable the synchronization destination: Google Groups\?/i);
        expect(confirmText).toBeInTheDocument();
        const confirmButton = screen.getByText('Yes');
        await user.click(confirmButton);

        await waitFor(() => {
            expect(updateSyncDest).toHaveBeenCalledWith('group:test:path', 'g1', false);
        });
        expect(await screen.findByLabelText('Google Groups')).toHaveAttribute('aria-checked', 'false');
    });

    it('closes the confirmation modal without confirming, preserving the old switch state', async () => {
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const googleSwitch = screen.getByLabelText('Google Groups');
        await user.click(googleSwitch);
        const modalText = await screen.findByText(/Are you sure you want to disable/i);
        expect(modalText).toBeInTheDocument();
        const cancelButton = screen.getByText(/cancel/i);
        await user.click(cancelButton);
        await waitFor(() => {
            expect(screen.queryByText(/Are you sure you want to disable/i)).not.toBeInTheDocument();
        });
        expect(updateSyncDest).not.toHaveBeenCalled();
        expect(googleSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('does not update state if resultCode !== "SUCCESS" (optional test)', async () => {
        (updateSyncDest as any).mockResolvedValue({ resultCode: 'FAIL' });
        render(<SyncDestinations syncDestArray={syncDestArray} groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const ldapSwitch = screen.getByLabelText('LDAP');
        expect(ldapSwitch).toHaveAttribute('aria-checked', 'false');
        await user.click(ldapSwitch);
        const yesBtn = await screen.findByText('Yes');
        await user.click(yesBtn);

        await waitFor(() => {
            expect(updateSyncDest).toHaveBeenCalledWith('group:test:path', 'ldap1', true);
        });
        expect(ldapSwitch).toHaveAttribute('aria-checked', 'false');
    });

    it('opens dynamic modal with empty body if tooltip is missing', async () => {
        const noTooltipArray = [
            {
                name: 'no-tip',
                description: 'NoTooltipDest',
                synced: false,
                hidden: false,
            },
        ];
        render(<SyncDestinations syncDestArray={noTooltipArray} groupingPath="group%3Atest%3Apath" />);
        const user = userEvent.setup();
        const infoIcon = screen.getByTestId('info-icon-no-tip');
        await user.click(infoIcon);
        const modal = await screen.findByRole('alertdialog', { name: /sync destinations information/i });
        expect(modal).toBeInTheDocument();
        expect(screen.queryByText('Hello tooltip')).not.toBeInTheDocument();
        const okBtn = screen.getByRole('button', { name: /Cancel/i });
        expect(okBtn).toBeInTheDocument();
        await user.click(okBtn);
        await waitFor(() => {
            expect(screen.queryByRole('dialog', { name: /sync destinations information/i })).not.toBeInTheDocument();
        });
    });

});
