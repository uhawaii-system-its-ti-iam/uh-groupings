import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/app/_components/layout/navbar/LoginButton';
import { redirect } from 'next/navigation';
import User, { AnonymousUser } from '@/access/User';
import Role from '@/access/Role';

const casUrl = process.env.NEXT_PUBLIC_CAS_URL as string;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('Login', () => {

    describe('User is not logged in', () => {

        it('should render a Login button', () => {
            render(<Login currentUser={AnonymousUser} />);

            expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument;
        });

        it('should visit the CAS login url on click', async() => {
            render(<Login currentUser={AnonymousUser} />);

            const casLoginUrl = `${casUrl}/login?service=${encodeURIComponent(`${baseUrl}/api/cas/login`)}`;
            await userEvent.click(screen.getByRole('button', { name: 'Login' }));
            expect(redirect).toHaveBeenCalledWith(casLoginUrl);
        });
        
    });

    describe('User is logged in', () => {

        beforeAll(() => {
            testUser.roles.push(Role.UH);
        });

        it('should render a Logout button with the uid of the logged-in user', () => {
            render(<Login currentUser={testUser} />);

            expect(screen.getByRole('button', { name: `Logout (${testUser.uid})` })).toBeInTheDocument;
        });

        it('should visit the CAS logout url on click', async () => {
            render(<Login currentUser={testUser} />);
            
            const casLogoutUrl = `${casUrl}/logout?service=${encodeURIComponent(`${baseUrl}/api/cas/logout`)}`;
            await userEvent.click(screen.getByRole('button', { name: `Logout (${testUser.uid})` }));
            expect(redirect).toHaveBeenCalledWith(casLogoutUrl);
        });

    });

});
