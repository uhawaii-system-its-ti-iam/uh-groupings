import { render, screen, waitFor } from '@testing-library/react';
import PersonTable from '@/app/admin/_components/person-table/person-table';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}));

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const mockResults = Array.from({ length: 200 }, (_, i) => ({
    path: `tmp:example:example-${i}`,
    name: `example-${i}`,
    description: `Test Description ${i}`,
    inBasis: true,
    inInclude: true,
    inExclude: false,
    inOwner: true,
    inBasisAndInclude: true,
    optOutEnabled: true,
    optInEnabled: true,
    selfOpted: true,

}));

const mockMembershipResults = {
    resultCode: 'SUCCESS',
    results: mockResults
};

const mockMemberResult = {
    uid: 'jdoe',
    uhUuid: '12345678',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe'
};

describe('PersonTable', () => {
    it('renders the header and filter correctly', async () => {
        render(
            <PersonTable
                membershipResults={mockMembershipResults}
                memberResult={mockMemberResult}
                uhIdentifier="jdoe"
                showWarning={false}
            />
        );
        const titles = screen.queryAllByText('Manage Person');
        expect(titles.length).toBeGreaterThan(0);
        await waitFor(() => {
            const filters = screen.queryAllByPlaceholderText('Filter Groupings...');
            expect(filters.length).toBeGreaterThan(0);
        });

        // Check for table column headers
        expect(screen.getByText('Grouping')).toBeInTheDocument();
        expect(screen.getByText('Owner?')).toBeInTheDocument();
        expect(screen.getByText('Basis?')).toBeInTheDocument();
        expect(screen.getByText('Include?')).toBeInTheDocument();
        expect(screen.getByText('Exclude?')).toBeInTheDocument();
        expect(screen.getByTestId('remove')).toBeInTheDocument();

        expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(mockResults.length);

        const firstPageGroupings = mockResults.slice(0, pageSize);
        firstPageGroupings.forEach((group) => {
            expect(screen.getAllByTestId('fa-up-right-from-square-icon')[0]).toBeInTheDocument();
            expect(screen.getByText(group.name)).toBeInTheDocument();
            expect(screen.getAllByTestId('fa-web-awesome-icon')[0]).toBeInTheDocument();
            expect(screen.queryAllByText('Yes').length).toBeGreaterThan(0);
            expect(screen.queryAllByText('No').length).toBeGreaterThan(0);
            expect(screen.getAllByTestId('person-remove')[0]).toBeInTheDocument();
        });

        // Check for pagination
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText(1)).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Last')).toBeInTheDocument();
    });
//     TODO: renders the correct link for manage person, filters data correctly using global filter, sorts data when
//      header is clicked, should paginate correctly
});
