import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Announcements from '@/app/(home)/_components/announcements';
import * as Fetchers from '@/lib/fetchers';

vi.mock('@/lib/fetchers');

const message = 'test announcement';
const message1 = 'test1 announcement';
const oldMessage = 'expired announcement';
const announcements = {
    resultCode: '200',
    announcements: [
        {
            message: message,
            state: 'Active',
            start: '4/11/2024',
            end: '4/15/2024'
        },
        {
            message: message1,
            state: 'Active',
            start: '4/11/2024',
            end: '4/15/2024'
        },
        {
            message: oldMessage,
            state: 'Expired',
            start: '4/11/2021',
            end: '4/15/2021'
        }
    ]
};

describe('Announcements', () => {
    it('renders announcement correctly', async () => {
        vi.spyOn(Fetchers, 'getAnnouncements').mockResolvedValue(announcements);
        render(await Announcements());

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(message1)).toBeInTheDocument();
        expect(screen.queryByText(oldMessage)).not.toBeInTheDocument();
    });
});
