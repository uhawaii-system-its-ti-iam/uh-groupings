import { render, screen, fireEvent } from '@testing-library/react';
import ExportDropdown from '@/app/groupings/[groupingPath]/_components/export-dropdown';

global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');

describe('ExportDropdown', () => {
    const mockGroupPath = 'tmp:test-group-path';

    const test1 = { firstName: 'firstName', lastName: 'lastName', uid: 'testUid', uhUuid: '123' };
    const test2 = { firstName: 'firstName', lastName: 'lastName', uid: 'testUid', uhUuid: '456' };
    const test3 = { firstName: 'firstName', lastName: 'lastName', uid: '', uhUuid: '789' };

    const mockGroupingMembers = {
        allMembers: { members: [test1, test2] },
        groupingInclude: { members: [test1, test2] },
        groupingExclude: { members: [test1, test2] },
        groupingBasis: { members: [test1, test2] }
    };

    const mockEmptyGroupingMembers = {
        allMembers: { members: [] },
        groupingInclude: { members: [] },
        groupingExclude: { members: [] },
        groupingBasis: { members: [] }
    };

    const mockGroupingWithEmptyUid = {
        allMembers: { members: [test3] },
        groupingInclude: { members: [] },
        groupingExclude: { members: [] },
        groupingBasis: { members: [] }
    };

    it('renders the button', () => {
        render(<ExportDropdown groupingMembers={mockGroupingMembers} groupPath={mockGroupPath} />);
        const buttonElement = screen.getByRole('button', { name: /Export Grouping/i });
        expect(buttonElement).toBeInTheDocument();
    });

    it('toggles the dropdown menu on button click', () => {
        render(<ExportDropdown groupingMembers={mockGroupingMembers} groupPath={mockGroupPath} />);

        const button = screen.getByRole('button', { name: /Export Grouping/i });
        fireEvent.click(button);

        const dropdownMenu = screen.getByRole('list');
        expect(dropdownMenu).toBeInTheDocument();

        fireEvent.click(button);
        expect(dropdownMenu).not.toBeVisible();
    });

    it('closes the dropdown when clicking outside', () => {
        render(<ExportDropdown groupingMembers={mockGroupingMembers} groupPath={mockGroupPath} />);
        const button = screen.getByRole('button', { name: /Export Grouping/i });

        fireEvent.click(button);
        expect(screen.getByRole('list')).toBeInTheDocument();

        fireEvent.click(document);
        expect(screen.queryByRole('list')).toBeNull();
    });

    it('displays only valid groupings in the dropdown', () => {
        render(<ExportDropdown groupingMembers={mockGroupingMembers} groupPath={mockGroupPath} />);

        const buttonElement = screen.getByRole('button', { name: /Export Grouping/i });
        fireEvent.click(buttonElement);

        const validGroupingLabels = screen.getAllByRole('button').map((btn) => btn.textContent);
        const expectedLabels = ['Export All Members', 'Export Include', 'Export Exclude', 'Export Basis'];

        expectedLabels.forEach((label) => {
            expect(validGroupingLabels).toContain(label);
        });
    });

    it('disables the button and applies when there are no valid groupings', () => {
        render(<ExportDropdown groupingMembers={mockEmptyGroupingMembers} groupPath={mockGroupPath} />);
        const buttonElement = screen.getByRole('button', { name: /Export Grouping/i });

        expect(buttonElement).toBeDisabled();

        const validGroupingLabels = screen.getAllByRole('button').map((btn) => btn.textContent);
        const invalidLabels = ['Export All Members', 'Export Include', 'Export Exclude', 'Export Basis'];

        invalidLabels.forEach((label) => {
            expect(validGroupingLabels).not.toContain(label);
        });
    });

    it('handles members with empty UID', () => {
        render(<ExportDropdown groupingMembers={mockGroupingWithEmptyUid} groupPath={mockGroupPath} />);

        const buttonElement = screen.getByRole('button', { name: /Export Grouping/i });
        fireEvent.click(buttonElement);

        const exportButton = screen.getByRole('button', { name: /Export All Members/i });
        fireEvent.click(exportButton);

        jest.spyOn(window, 'Blob').mockImplementation((data) => {
            const content = data?.[0] ?? '';
            expect(content).toContain('Last,First,Username,UH Number,Email');
            expect(content).toContain('lastName,firstName,,789,');

            return new Blob([content], { type: 'text/csv' });
        });

        jest.restoreAllMocks();
    });

    it('generates a CSV download link with correct content for all export options', () => {
        const exportOptions = [
            { buttonName: /Export All Members/i, downloadFile: 'members_list.csv' },
            { buttonName: /Export Include/i, downloadFile: 'include_list.csv' },
            { buttonName: /Export Exclude/i, downloadFile: 'exclude_list.csv' },
            { buttonName: /Export Basis/i, downloadFile: 'basis_list.csv' }
        ];

        exportOptions.forEach(({ buttonName, downloadFile }) => {
            render(<ExportDropdown groupingMembers={mockGroupingMembers} groupPath={mockGroupPath} />);

            const buttons = screen.getAllByRole('button', { name: /Export Grouping/i });
            const exportGroupingButton = buttons[0];
            fireEvent.click(exportGroupingButton);

            const linkClickSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
                const mockLink = {
                    setAttribute: jest.fn(),
                    click: jest.fn(),
                    download: '',
                    href: ''
                } as unknown as HTMLAnchorElement;
                return mockLink;
            });

            const exportButton = screen.getByRole('button', { name: buttonName });
            fireEvent.click(exportButton);

            const exportLink = linkClickSpy.mock.results[0].value;
            const groupName = mockGroupPath.split(':').pop();
            expect(exportLink.download).toBe(`${groupName}_${downloadFile}`);
            expect(exportLink.href).toContain('blob:');

            jest.spyOn(window, 'Blob').mockImplementation((data) => {
                const content = data?.[0] ?? '';
                expect(content).toContain('Last,First,Username,UH Number,Email');
                expect(content).toContain('lastName,firstName,testUid,123,testUid@hawaii.edu');
                expect(content).toContain('lastName,firstName,testUid,456,testUid@hawaii.edu');

                return new Blob([content], { type: 'text/csv' });
            });

            jest.restoreAllMocks();
        });
    });
});
