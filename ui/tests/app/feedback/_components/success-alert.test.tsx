import { describe, it, expect } from 'vitest';
import SuccessAlert from '@/app/feedback/_components/success-alert';
import { render, screen } from '@testing-library/react';

describe('SuccessAlert', () => {
    it('should render', () => {
        render(<SuccessAlert />);

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('heading')).toBeInTheDocument();
    });
});
