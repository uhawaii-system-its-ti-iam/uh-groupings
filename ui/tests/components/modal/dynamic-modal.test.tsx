import { describe, it, vi, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynamicModal from '@/components/modal/dynamic-modal';
import Link from 'next/link';

describe('DynamicModal', () => {
    it('should open an informational modal with test contents and no extra buttons', async () => {
        const onClose = vi.fn();
        render(
            <DynamicModal open={true} title="A Dynamic Title" onClose={onClose} body="Some dynamic message here." />
        );
        const user = userEvent.setup();
        await user.tab();

        expect(screen.getByRole('alertdialog', { name: 'A Dynamic Title' })).toBeInTheDocument();
        expect(screen.getByRole('alertdialog')).toHaveTextContent('Some dynamic message here.');

        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should open an informational modal with test contents and extra buttons', async () => {
        const onClose = vi.fn();
        render(
            <DynamicModal
                open={true}
                title="A Dynamic Title"
                body="Some dynamic message here."
                onClose={onClose}
                buttons={[<>Button1</>, <>Button2</>]}
            />
        );
        const user = userEvent.setup();
        await user.tab();

        expect(screen.getByRole('alertdialog', { name: 'A Dynamic Title' })).toBeInTheDocument();
        expect(screen.getByRole('alertdialog')).toHaveTextContent('Some dynamic message here.');

        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Button1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Button2' })).toBeInTheDocument();
    });

    it('should close the modal upon clicking the Cancel button', async () => {
        const onClose = vi.fn();
        render(
            <DynamicModal
                open={true}
                title="A Dynamic Title"
                body="Some dynamic message here."
                onClose={onClose}
                buttons={[]}
            />
        );
        const user = userEvent.setup();
        await user.tab();

        expect(screen.getByRole('alertdialog', { name: 'A Dynamic Title' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'A Dynamic Title' })).toBeInTheDocument();
        expect(screen.getByRole('alertdialog')).toHaveTextContent('Some dynamic message here.');

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeInTheDocument();

        await user.click(cancelButton);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should close the modal and route to the provided link (Feedback)', async () => {
        const onClose = vi.fn();
        render(
            <DynamicModal
                open={true}
                title="A Modal to the Feedback Page"
                body="Click Feedback to go to the Feedback Page."
                onClose={onClose}
                buttons={[
                    <Link key={'feedbackButton'} href={'/feedback'}>
                        Feedback
                    </Link>
                ]}
            />
        );
        const user = userEvent.setup();
        await user.tab();

        expect(screen.getByRole('alertdialog', { name: 'A Modal to the Feedback Page' })).toBeInTheDocument();
        expect(screen.getByRole('alertdialog')).toHaveTextContent('Click Feedback to go to the Feedback Page.');

        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Feedback' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');

        await user.click(screen.getByRole('button', { name: 'Feedback' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
