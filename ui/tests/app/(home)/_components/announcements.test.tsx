import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Announcements from '@/app/(home)/_components/announcements';
import * as Fetchers from '@/lib/fetchers';

vi.mock('@/lib/fetchers');

const message = 'test announcement';
const message1 = 'test1 announcement';
const announcements = {
    resultCode: '200',
    announcements: [
        {
            message: message
        },
        {
            message: message1
        }
    ]
};

const singleAnnouncement = {
    resultCode: '200',
    announcements: [
        {
            message: message
        }
    ]
};

const emptyAnnouncements = {
    resultCode: '200',
    announcements: []
};

describe('Announcements', () => {
    it('renders announcement correctly', async () => {
        vi.spyOn(Fetchers, 'getAnnouncements').mockResolvedValue(announcements);
        render(await Announcements());

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(message1)).toBeInTheDocument();
        expect(screen.getAllByRole('alert')).toHaveLength(2);
    });

    it('renders a single announcement', async () => {
        vi.spyOn(Fetchers, 'getAnnouncements').mockResolvedValue(singleAnnouncement);
        render(await Announcements());

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getAllByRole('alert')).toHaveLength(1);
    });

    it('renders no alerts when there are no announcements', async () => {
        vi.spyOn(Fetchers, 'getAnnouncements').mockResolvedValue(emptyAnnouncements);
        render(await Announcements());

        expect(screen.queryAllByRole('alert')).toHaveLength(0);
    });

    describe('dismissible alerts', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('dismissing one announcement leaves the other visible', async () => {
            vi.spyOn(Fetchers, 'getAnnouncements').mockResolvedValue(announcements);
            render(await Announcements());

            const closeButtons = screen.getAllByRole('button', { name: 'Close' });
            expect(closeButtons).toHaveLength(2);

            fireEvent.click(closeButtons[0]);
            act(() => {
                vi.runAllTimers();
            });

            expect(screen.queryByText(message)).not.toBeInTheDocument();
            expect(screen.getByText(message1)).toBeInTheDocument();
            expect(screen.getAllByRole('alert')).toHaveLength(1);
        });
    });
});
