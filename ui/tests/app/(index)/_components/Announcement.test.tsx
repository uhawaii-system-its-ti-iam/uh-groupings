import { render, screen } from '@testing-library/react';
import Announcements from '@/app/(index)/_components/Announcements';
import * as GroupingsApiService from '@/services/GroupingsApiService';

jest.mock('@/services/GroupingsApiService');

const message = 'test announcement';
const message1 = 'test1 announcement';
const oldMessage = 'expired announcement';
const announcements = {
    resultCode: '200',
    announcements: [
        { message: message, state: 'Active', start: '4/11/2024', end: '4/15/2024' },
        { message: message1, state: 'Active', start: '4/11/2024', end: '4/15/2024' },
        { message: oldMessage, state: 'Expired', start: '4/11/2021', end: '4/15/2021' },
    ]
};

describe('Announcements Component', () => {
    it('renders announcement correctly', async () => {
        jest.spyOn(GroupingsApiService, 'getAnnouncements').mockResolvedValue(announcements);
        render(await Announcements());

        expect(screen.getAllByLabelText('icon')).toHaveLength(2);
        expect(screen.getAllByText('Announcement')).toHaveLength(2);
        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(message1)).toBeInTheDocument();
        expect(screen.queryByText(oldMessage)).not.toBeInTheDocument();
    });
});
