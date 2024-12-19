import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ApiErrorModal from '@/components/modal/api-error-modal';

describe('ApiErrorModal', () => {
    it('should open the API Error modal', () => {
        render(<ApiErrorModal open={true} />);
        fireEvent.focus(document);

        expect(screen.getByRole('alertdialog', { name: 'Error' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'feedback page.' })).toHaveAttribute('href', '/feedback');
        expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
        expect(screen.getByRole('button', { name: 'OK' }));
        expect(screen.getByRole('button', { name: 'Feedback' }));
    });

    it('should close the API Error modal if open evaluates to false', () => {
        render(<ApiErrorModal open={false} />);
        fireEvent.focus(document);

        expect(screen.queryByRole('alertdialog', { name: 'Error' })).not.toBeInTheDocument();
    });

    it('should close the modal after clicking the Feedback button', () => {
        render(<ApiErrorModal open={true} />);
        fireEvent.focus(document);

        expect(screen.getByRole('alertdialog', { name: 'Error' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Feedback' }));
        expect(screen.queryByRole('alertdialog', { name: 'Error' })).not.toBeInTheDocument();
    });

    it('should close the modal after clicking the provided link', () => {
        render(<ApiErrorModal open={true} />);
        fireEvent.focus(document);

        expect(screen.getByRole('alertdialog', { name: 'Error' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('link', { name: 'feedback page.' }));
        expect(screen.queryByRole('alertdialog', { name: 'Error' })).not.toBeInTheDocument();
    });

    it('should close the modal after clicking the OK button', () => {
        render(<ApiErrorModal open={true} />);
        fireEvent.focus(document);

        expect(screen.getByRole('alertdialog', { name: 'Error' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'OK' }));
        expect(screen.queryByRole('alertdialog', { name: 'Error' })).not.toBeInTheDocument();
    });
});
