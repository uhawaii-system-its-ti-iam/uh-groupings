import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import SessionMonitor from '@/components/auth/session-monitor';
import { authClient } from '@/lib/auth-client';
import { usePathname, useRouter } from 'next/navigation';

const replace = vi.fn();

vi.mock('@/lib/auth-client', () => ({ authClient: { useSession: vi.fn() } }));
vi.mock('next/navigation', () => ({ usePathname: vi.fn(), useRouter: vi.fn() }));

describe('SessionMonitor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useRouter).mockReturnValue({ replace } as never);
        vi.mocked(usePathname).mockReturnValue('/uhgroupings/groupings');
        window.history.replaceState({}, '', '/uhgroupings/groupings?tab=members');
    });

    it('redirects an expired Better Auth session from a protected page, preserving the destination', async () => {
        vi.mocked(authClient.useSession).mockReturnValue({ data: null, isPending: false, error: null } as never);
        render(<SessionMonitor />);

        await waitFor(() => expect(replace).toHaveBeenCalledWith(
            '/uhgroupings/?callbackURL=%2Fuhgroupings%2Fgroupings%3Ftab%3Dmembers'
        ));
    });

    it('does not redirect an active, loading, failed, or public-page session check', () => {
        vi.mocked(authClient.useSession).mockReturnValue({ data: { user: {} }, isPending: false, error: null } as never);
        const { rerender } = render(<SessionMonitor />);
        vi.mocked(authClient.useSession).mockReturnValue({ data: null, isPending: true, error: null } as never);
        rerender(<SessionMonitor />);
        vi.mocked(authClient.useSession).mockReturnValue({ data: null, isPending: false, error: new Error('offline') } as never);
        rerender(<SessionMonitor />);
        vi.mocked(usePathname).mockReturnValue('/uhgroupings/about');
        vi.mocked(authClient.useSession).mockReturnValue({ data: null, isPending: false, error: null } as never);
        rerender(<SessionMonitor />);

        expect(replace).not.toHaveBeenCalled();
    });
});
