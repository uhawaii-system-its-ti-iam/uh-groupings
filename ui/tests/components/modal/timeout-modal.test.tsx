import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import Role from '@/lib/access/role';
import User from '@/lib/access/user';
import TimeoutModal from '@/components/modal/timeout-modal';
import { act, fireEvent, render, screen } from '@testing-library/react';
import * as NextCasClient from 'next-cas-client';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('next-cas-client');

describe('TimeoutModal', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        testUser.roles = [];
    });

    it('should not open the timeout modal when the user is not logged-in', () => {
        render(<TimeoutModal currentUser={testUser} />);

        act(() => vi.advanceTimersByTime(1000 * 60 * 25));
        fireEvent.focus(document);

        expect(screen.queryByRole('alertdialog', { name: 'Inactivity Warning' })).not.toBeInTheDocument();
    });

    it('should not open the timeout modal before 25 minutes of idle', () => {
        testUser.roles.push(Role.UH);
        render(<TimeoutModal currentUser={testUser} />);

        act(() => vi.advanceTimersByTime(1000 * 60 * 24));
        fireEvent.focus(document);

        expect(screen.queryByRole('alertdialog', { name: 'Inactivity Warning' })).not.toBeInTheDocument();
    });

    it('should open the timeout modal after 25 minutes of idle', () => {
        testUser.roles.push(Role.UH);
        render(<TimeoutModal currentUser={testUser} />);

        act(() => vi.advanceTimersByTime(1000 * 60 * 25));
        fireEvent.focus(document);

        expect(screen.getByRole('alertdialog', { name: 'Inactivity Warning' })).toBeInTheDocument();
    });

    it('should display the countdown timer', () => {
        testUser.roles.push(Role.UH);
        render(<TimeoutModal currentUser={testUser} />);

        act(() => vi.advanceTimersByTime(1000 * 60 * 25));
        fireEvent.focus(document);

        expect(screen.getByRole('alertdialog', { name: 'Inactivity Warning' })).toBeInTheDocument();

        for (let i = 5; i >= 0; i--) {
            expect(screen.getByText(i + ':00.')).toBeInTheDocument();
            act(() => vi.advanceTimersByTime(1000 * 60));
            fireEvent.focus(document);
        }
    });

    it('should reset the idle timer when "Stay logged in" is pressed', () => {
        testUser.roles.push(Role.UH);
        render(<TimeoutModal currentUser={testUser} />);

        act(() => vi.advanceTimersByTime(1000 * 60 * 25));
        fireEvent.focus(document);

        expect(screen.getByRole('alertdialog', { name: 'Inactivity Warning' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Stay logged in' }));
        expect(screen.queryByRole('alertdialog', { name: 'Inactivity Warning' })).not.toBeInTheDocument();

        act(() => vi.advanceTimersByTime(1000 * 60 * 24));
        fireEvent.focus(document);

        expect(screen.queryByRole('alertdialog', { name: 'Inactivity Warning' })).not.toBeInTheDocument();
    });

    it('should logout when "Log off now" is pressed', () => {
        const logoutSpy = vi.spyOn(NextCasClient, 'logout');

        testUser.roles.push(Role.UH);
        render(<TimeoutModal currentUser={testUser} />);

        act(() => vi.advanceTimersByTime(1000 * 60 * 25));
        fireEvent.focus(document);

        expect(screen.getByRole('alertdialog', { name: 'Inactivity Warning' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Log off now' }));
        expect(logoutSpy).toHaveBeenCalled();
    });

    it('should logout after 30 minutes of idle', () => {
        const logoutSpy = vi.spyOn(NextCasClient, 'logout');

        testUser.roles.push(Role.UH);
        render(<TimeoutModal currentUser={testUser} />);

        act(() => vi.advanceTimersByTime(1000 * 60 * 30 + 1));
        fireEvent.focus(document);

        expect(logoutSpy).toHaveBeenCalled();
    });
});
