import { render, screen, waitFor } from '@testing-library/react';
import Groupings from '@/app/groupings/page';
import * as GroupingsApiService from '@/actions/groupings-api';

// Mock the `ownerGroupings` function
jest.mock('@/actions/groupings-api', () => ({
    ownerGroupings: jest.fn()
}));

// Define the expected types
interface GroupingPaths {
    groupingPaths: { path: string; name: string; description: string; }[];
}

interface ApiError {
    resultCode: string;
}

// Combine types to fit the expected response
const mockData: GroupingPaths & ApiError = {
    resultCode: 'SUCCESS',
    groupingPaths: Array.from({length: 10}, (_, i) => ({
        path: `tmp:example:example-${i}`,
        name: `example-${i}`,
        description: `Test Description ${i}`
    }))
};

beforeEach(() => {
    (GroupingsApiService.ownerGroupings as jest.Mock).mockResolvedValue(mockData);
});

describe('Groupings', () => {
    it('should render the Groupings page with the appropriate header and group data', async () => {
        render(await Groupings());

        // Verify page elements
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Manage My Groupings/i })).toBeInTheDocument();
        expect(screen.getByText(/View and manage groupings I own. Manage members, configure grouping options and sync destinations./i)).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();

        // check if specific group names are present
        mockData.groupingPaths.forEach(group => {
            expect(screen.getByText(group.name)).toBeInTheDocument();
        });
    });
});
