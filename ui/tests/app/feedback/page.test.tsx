import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Feedback from '@/app/feedback/page';
import User from '@/lib/access/user';
import { getUser } from '@/lib/access/user.server';
import Role from '@/lib/access/role';
import { setRoles } from '@/lib/access/authorization';

vi.mock('@/lib/access/user.server', () => ({
    getUser: vi.fn(),
}));
vi.mock('@/lib/access/authorization', () => ({ setRoles: vi.fn() }));

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('Feedback', () => {
    it('renders the Feedback form for a Better Auth application-session user', async () => {
        const signedInUser = { ...testUser, roles: [Role.UH] };
        vi.mocked(getUser).mockResolvedValue(signedInUser);
        vi.mocked(setRoles).mockResolvedValue(signedInUser);

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
