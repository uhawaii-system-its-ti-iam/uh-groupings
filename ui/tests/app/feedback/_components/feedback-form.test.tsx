import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Email from '@/actions/email';
import User from '@/access/user';
import FeedbackForm from '@/app/feedback/_components/feedback-form';
import { Toaster } from '@/components/ui/toaster';

jest.mock('@/actions/email');

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('FeedbackForm', () => {
    it('should display the email of the currentUser in the Email Address form field', () => {
        render(<FeedbackForm currentUser={testUser} />);

        expect(
            screen.getByRole('textbox', { name: 'Email Address: *' })
        ).toHaveValue('testiwta@hawaii.edu');
    });

    it('should display the success toast after submission', async () => {
        const user = userEvent.setup();

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <>
                {children}
                <Toaster />
            </>
        );
        render(<FeedbackForm currentUser={testUser} />, { wrapper });

        jest.spyOn(Email, 'sendFeedback').mockResolvedValue({
            resultCode: 'SUCCESS',
            recipient: 'recipient',
            from: 'from',
            subject: 'subject',
            text: 'text'
        });

        await user.type(
            screen.getByRole('textbox', { name: 'Your Feedback: *' }),
            'This is a test to see if the success toast shows.'
        );
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('should display the error toast after submission', async () => {
        const user = userEvent.setup();

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <>
                {children}
                <Toaster />
            </>
        );
        render(<FeedbackForm currentUser={testUser} />, { wrapper });

        jest.spyOn(Email, 'sendFeedback').mockResolvedValue({
            resultCode: 'FAILURE',
            recipient: 'recipient',
            from: 'from',
            subject: 'subject',
            text: 'text'
        });

        await user.type(
            screen.getByRole('textbox', { name: 'Your Feedback: *' }),
            'This is a test to see if the error toast shows.'
        );
        await user.tab();
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('Error')).toBeInTheDocument();
    });
});
