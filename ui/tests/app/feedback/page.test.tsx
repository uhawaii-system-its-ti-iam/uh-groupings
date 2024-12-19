import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Feedback from '@/app/feedback/page';
import * as NextCasClient from 'next-cas-client/app';
import User from '@/lib/access/user';

vi.mock('next-cas-client/app');

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('Feedback', () => {
    it('should render the Feedback form', async () => {
        vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);

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
