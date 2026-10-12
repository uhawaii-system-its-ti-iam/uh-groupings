import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import ReturnButtons from '@/app/groupings/[groupingPath]/_components/return-buttons';

vi.mock('next/navigation', () => ({ useSearchParams: vi.fn() }));

describe('ReturnButtons Component', () => {
    beforeEach(() => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>);
    });

    it.each(['from=admin', 'from=groupings&from=admin', 'from=admin&from=groupings'])(
        'returns to the Admin grouping list for %s', (query) => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams(query) as ReturnType<typeof useSearchParams>);
        render(<ReturnButtons fromManageSubject={false} />);

        expect(screen.getByRole('link', { name: /return to groupings list/i })).toHaveAttribute('href', '/admin/manage-groupings');
    });

    it('defaults to Groupings for an unrecognized origin', () => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('from=unknown') as ReturnType<typeof useSearchParams>);
        render(<ReturnButtons fromManageSubject={false} />);

        expect(screen.getByRole('link', { name: /return to groupings list/i })).toHaveAttribute('href', '/groupings');
    });

    it('renders button to return to Groupings List when fromManageSubject is false', () => {
        render(<ReturnButtons fromManageSubject={false} />);

        expect(screen.getByRole('link', { name: /return to groupings list/i })).toHaveAttribute('href', '/groupings');
        expect(screen.queryByText(/return to manage person/i)).not.toBeInTheDocument();
    });

    it('renders button to return to Manage Person when fromManageSubject is true', () => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('from=admin') as ReturnType<typeof useSearchParams>);
        render(<ReturnButtons fromManageSubject={true} />);

        expect(screen.getByRole('link', { name: /return to manage person/i })).toHaveAttribute('href', '/manage-person');
        expect(screen.queryByText(/return to groupings list/i)).not.toBeInTheDocument();
    });
});
