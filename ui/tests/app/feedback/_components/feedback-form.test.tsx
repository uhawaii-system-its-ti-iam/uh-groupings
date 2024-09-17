import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Actions from '@/lib/actions';
import User from '@/access/user';
import FeedbackForm from '@/app/feedback/_components/feedback-form';

jest.mock('@/lib/actions');

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('FeedbackForm', () => {
    it('should display the email of the currentUser in the Email Address form field', () => {
        render(<FeedbackForm currentUser={testUser} />);

        expect(screen.getByRole('textbox', { name: 'Email Address: *' })).toHaveValue('testiwta@hawaii.edu');
    });

    it('should display the success alert after submission', async () => {
        const text = 'This is a test to see if the success alert shows.';

        const user = userEvent.setup();
        render(<FeedbackForm currentUser={testUser} />);

        jest.spyOn(Actions, 'sendFeedback').mockResolvedValue({
            resultCode: 'SUCCESS',
            recipient: 'recipient',
            from: 'from',
            subject: 'subject',
            text: 'text'
        });

        await user.type(screen.getByRole('textbox', { name: 'Your Feedback: *' }), text);
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Thank You!' })).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: 'Your Feedback: *' })).not.toHaveValue(text);
    });

    it('should display the error alert after submission', async () => {
        const text = 'This is a test to see if the error alert shows.';

        const user = userEvent.setup();
        render(<FeedbackForm currentUser={testUser} />);

        jest.spyOn(Actions, 'sendFeedback').mockResolvedValue({
            resultCode: 'FAILURE',
            recipient: 'recipient',
            from: 'from',
            subject: 'subject',
            text: 'text'
        });

        await user.type(screen.getByRole('textbox', { name: 'Your Feedback: *' }), text);
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Oops!' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Your Feedback: *' })).toHaveValue(text);
    });

    it('should only display one alert at a time after multiple submissions', async () => {
        const user = userEvent.setup();
        render(<FeedbackForm currentUser={testUser} />);

        jest.spyOn(Actions, 'sendFeedback').mockResolvedValueOnce({
            resultCode: 'FAILURE',
            recipient: 'recipient',
            from: 'from',
            subject: 'subject',
            text: 'text'
        });

        jest.spyOn(Actions, 'sendFeedback').mockResolvedValueOnce({
            resultCode: 'SUCCESS',
            recipient: 'recipient',
            from: 'from',
            subject: 'subject',
            text: 'text'
        });

        await user.type(
            screen.getByRole('textbox', { name: 'Your Feedback: *' }),
            'This is a test to see if only one alert displays at a time.'
        );
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Oops!' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Thank You!' })).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByRole('alert')).toBeInTheDocument();
        await waitFor(() => {
            // waitFor corrects failure in GitHub actions due to its slow processor
            expect(screen.getByRole('heading', { name: 'Thank You!' })).toBeInTheDocument();
        });
        expect(screen.queryByRole('heading', { name: 'Oops!' })).not.toBeInTheDocument();
    });
});
