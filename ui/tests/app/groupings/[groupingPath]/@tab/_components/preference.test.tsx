vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn(),
    }),
}));


import { describe, it, vi, expect, beforeEach, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Preferences from '@/app/groupings/[groupingPath]/@tab/_components/preference';
import { updateOptIn, updateOptOut } from '@/lib/actions';

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

describe('Preferences Component', () => {
    const groupingPath = 'group%3Atest%3Apath';

    beforeEach(() => {
        vi.clearAllMocks();
        (updateOptIn as any).mockResolvedValue({ resultCode: 'SUCCESS', updatedStatus: true });
        (updateOptOut as any).mockResolvedValue({ resultCode: 'SUCCESS', updatedStatus: true });
    });

    it('renders Preferences title and description', () => {
        render(<Preferences groupingPath={groupingPath} />);
        expect(screen.getByText('Preferences')).toBeInTheDocument();
        expect(screen.getByText(/Changes made may not take effect immediately/i)).toBeInTheDocument();
    });

    it('toggles opt-in and updates state via API', async () => {
        render(<Preferences groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const optInSwitch = screen.getByLabelText(/allow people to add themselves/i);
        expect(optInSwitch).toHaveAttribute('aria-checked', 'false');

        await user.click(optInSwitch);
        await waitFor(() => {
            expect(updateOptIn).toHaveBeenCalledWith('group:test:path', true);
        });
        expect(optInSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles opt-out and updates state via API', async () => {
        render(<Preferences groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const optOutSwitch = screen.getByLabelText(/allow people to remove themselves/i);
        expect(optOutSwitch).toHaveAttribute('aria-checked', 'false');

        await user.click(optOutSwitch);
        await waitFor(() => {
            expect(updateOptOut).toHaveBeenCalledWith('group:test:path', true);
        });
        expect(optOutSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('shows modal with opt-in tooltip when question icon clicked', async () => {
        render(<Preferences groupingPath={groupingPath} />);
        const user = userEvent.setup();

        const iconDiv = screen.getByText(/allow people to add themselves/i).parentElement?.querySelector('div.cursor-pointer');
        expect(iconDiv).toBeTruthy();
        await user.click(iconDiv!);

        expect(await screen.findByText(/enable the opt-in self-service/i)).toBeInTheDocument();

        const okButton = screen.getByRole('button', { name: /ok/i });
        await user.click(okButton);

        await waitFor(() => {
            expect(screen.queryByText(/enable the opt-in self-service/i)).not.toBeInTheDocument();
        });
    });

    it('shows modal with opt-out tooltip when question icon clicked', async () => {
        render(<Preferences groupingPath={groupingPath} />);
        const user = userEvent.setup();

        const iconDivs = screen.getAllByText(/allow people/i).map(label =>
            label.parentElement?.querySelector('div.cursor-pointer')
        );
        expect(iconDivs[1]).toBeTruthy();
        await user.click(iconDivs[1]!);

        expect(await screen.findByText(/enable the opt-out self-service/i)).toBeInTheDocument();

        const okButton = screen.getByRole('button', { name: /ok/i });
        await user.click(okButton);

        await waitFor(() => {
            expect(screen.queryByText(/enable the opt-out self-service/i)).not.toBeInTheDocument();
        });
    });

    it('opens modal manually via openModal call with content', async () => {
        render(<Preferences groupingPath={groupingPath} />);
        const user = userEvent.setup();
        const iconDiv = screen.getByText(/allow people to add themselves/i).parentElement?.querySelector('div.cursor-pointer');
        await user.click(iconDiv!);
        expect(await screen.findByText(/enable the opt-in self-service/i)).toBeInTheDocument();
    });

    it('triggers form onSubmit and prevents default behavior', () => {
        render(<Preferences groupingPath="group%3Atest%3Apath" />);

        const form = screen.getByTestId('preferences-form');

        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        submitEvent.preventDefault = vi.fn();

        form.dispatchEvent(submitEvent);

        expect(submitEvent.preventDefault).toHaveBeenCalled();
    });

});
