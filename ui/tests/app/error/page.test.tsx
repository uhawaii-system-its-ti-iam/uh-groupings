import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorPage from '@/app/error/page';

describe('Standalone error page', () => {
    it('shows the error and exit links without requiring browser history', () => {
        render(<ErrorPage />);

        expect(screen.getByRole('heading', { name: 'Error', level: 1 })).toBeInTheDocument();
        expect(screen.getByText(/unexpected communications problem/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
});
