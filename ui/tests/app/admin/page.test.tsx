//import AdminLayout from '@/app/admin/layout';
import Admin from '@/app/admin/page';
import { render, screen } from '@testing-library/react';
import * as Fetchers from '@/lib/fetchers';
import { MemberResult, GroupingPaths } from '@/lib/types';

jest.mock('@/lib/fetchers');

const mockGroupingsData: GroupingPaths = {
    resultCode: 'SUCCESS',
    groupingPaths: Array.from({ length: 10 }, (_, i) => ({
        path: `tmp:example:example-${i}`,
        name: `example-${i}`,
        description: `Test Description ${i}`
    }))
};

const mockAdminsData: MemberResult = {
    resultCode: 'SUCCESS',
    members: Array.from({ length: 10 }, (_, i) => ({
        name: `example-${i}`,
        uid: `example-${i}`,
        uhUuid: `example-${i}`
    }))
};

beforeEach(() => {
    jest.spyOn(Fetchers, 'ownerGroupings').mockResolvedValue(mockGroupingsData);
    jest.spyOn(Fetchers, 'groupingAdmins').mockResolvedValue(mockAdminsData);
});

describe('Admin', () => {
    it('should render the Admin page with the appropriate header and tabs', async () => {
        render(await Admin());

        expect(screen.getByRole('main')).toBeInTheDocument();

        /*expect(screen.getByRole('heading', { name: 'UH Groupings Administration' })).toBeInTheDocument();
        expect(
            screen.getByText(
                'Search for and manage any grouping on behalf of its owner. ' +
                    'Manage the list of UH Groupings administrators.'
            )
        ).toBeInTheDocument();*/

        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Manage Groupings' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Manage Admins' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Manage Person' })).toBeInTheDocument();
    });
});
