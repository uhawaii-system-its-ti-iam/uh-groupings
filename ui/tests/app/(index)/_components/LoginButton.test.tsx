import { render, screen, fireEvent } from '@testing-library/react';
import { redirect } from 'next/navigation';
import User, { AnonymousUser } from '@/access/User';
import Role from '@/access/Role';
import LoginButton from '@/app/(index)/_components/LoginButton';

const casUrl = process.env.NEXT_PUBLIC_CAS_URL as string;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('LoginButton Component', () => {

    describe('User is not logged in', () => {
        it('should render a Login button', () => {
            render(<LoginButton currentUser={AnonymousUser}/>);

            expect(screen.getByRole('button', {name: 'Login Here'})).toBeInTheDocument;
        });
        it('should visit the CAS login url on click', () => {
            render(<LoginButton currentUser={AnonymousUser}/>);

            const casLoginUrl = `${casUrl}/login?service=${encodeURIComponent(`${baseUrl}/api/cas/login`)}`;
            fireEvent.click(screen.getByRole('button', {name: 'Login Here'}));
            expect(redirect).toHaveBeenCalledWith(casLoginUrl);
        });
    });

    describe('User is logged in', () => {
        beforeAll(() => {
            testUser.roles.push(Role.UH);
        });

        it('should render a Logout button with the uid of the logged-in user', () => {
            render(<LoginButton currentUser={testUser}/>);

            expect(screen.getByRole('button', {name: 'Logout'})).toBeInTheDocument;
        });

        it('should visit the CAS logout url on click', () => {
            render(<LoginButton currentUser={testUser}/>);

            const casLogoutUrl = `${casUrl}/logout?service=${encodeURIComponent(`${baseUrl}/api/cas/logout`)}`;
            fireEvent.click(screen.getByRole('button', {name: 'Logout'}));
            expect(redirect).toHaveBeenCalledWith(casLogoutUrl);
        });
    });
});
