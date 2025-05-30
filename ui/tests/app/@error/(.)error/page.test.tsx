import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const backMock = vi.fn();

vi.mock('next/navigation', async () => {
    const actual = await vi.importActual<typeof import('next/navigation')>('next/navigation');
    return {
        ...actual,
        useRouter: () => ({
            back: backMock,
        }),
    };
});

import Page from '@/app/@error/(.)error/page';

describe('Error Modal Page', () => {
    it('renders ApiErrorModal and calls router.back() on close', () => {
        render(<Page />);

        expect(screen.getByRole('alertdialog')).toBeInTheDocument();

        const okButton = screen.getByRole('button', { name: /ok/i });
        fireEvent.click(okButton);

        expect(backMock).toHaveBeenCalled();
    });
});
