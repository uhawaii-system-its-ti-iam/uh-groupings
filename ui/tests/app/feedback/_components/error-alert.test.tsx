import { describe, it, expect } from 'vitest';
import ErrorAlert from '@/app/feedback/_components/error-alert';
import { render, screen } from '@testing-library/react';

describe('ErrorAlert', () => {
    it('should render', () => {
        render(<ErrorAlert />);

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('heading')).toBeInTheDocument();
    });
});
