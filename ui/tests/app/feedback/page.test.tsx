import { render, screen } from '@testing-library/react';
import Feedback from '@/app/feedback/page';
import * as Authentication from '@/access/authentication';
import User from '@/access/user';

jest.mock('@/access/authentication');

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('Feedback', () => {
    it('should render the Feedback form', async () => {
        jest.spyOn(Authentication, 'getCurrentUser').mockResolvedValue(testUser);

        render(await Feedback());

        expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument();

        expect(
            screen.getByText('Helps us to understand where improvements are needed. Please let us know.')
        ).toBeInTheDocument();
        expect(screen.getByText('Feedback Type:')).toBeInTheDocument();
        expect(screen.getByText('Your Name (Optional):')).toBeInTheDocument();
        expect(screen.getByText('Email Address:')).toBeInTheDocument();
        expect(screen.getByText('Your Feedback:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
});
