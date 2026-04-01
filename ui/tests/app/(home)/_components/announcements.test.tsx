import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('Announcements', () => {
    it('renders announcement correctly', async () => {
        vi.spyOn(Fetchers, 'getAnnouncements').mockResolvedValue(announcements);
        render(await Announcements());

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(message1)).toBeInTheDocument();
    });
});
