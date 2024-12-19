import { vi, describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import DeptAccountIcon from '@/components/layout/navbar/dept-account-icon';
import User, { AnonymousUser } from '@/lib/access/user';
import * as NextCasClient from 'next-cas-client/app';
import Role from '@/lib/access/role';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('next-cas-client/app');

describe('Dept Account Icon', () => {
    it('should render the Departmental Account icon and open warning modal when clicked on', () => {
        testUser.roles = [Role.DEPARTMENTAL];
        render(<DeptAccountIcon currentUser={testUser} />);

        fireEvent.focus(document);
        expect(screen.getByLabelText('Departmental Account Icon')).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('Departmental Account Icon'));
        expect(screen.getByRole('alertdialog', { name: 'Warning' })).toBeInTheDocument();
        expect(screen.getByRole('alertdialog')).toHaveTextContent('You are not in your personal account');
    });

    it('should not render the Departmental Account icon for other roles', () => {
        vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(AnonymousUser);
        testUser.roles = [Role.ANONYMOUS, Role.ADMIN, Role.UH, Role.OWNER];
        render(<DeptAccountIcon currentUser={testUser} />);

        fireEvent.focus(document);
        expect(screen.queryByRole('button', { name: 'Departmental Account Icon' })).not.toBeInTheDocument();
    });
});
