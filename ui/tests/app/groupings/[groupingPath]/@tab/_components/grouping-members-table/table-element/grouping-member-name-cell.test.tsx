import GroupingMemberNameCell from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/table-element/grouping-member-name-cell';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('GroupingMemberNameCell', () => {
    const name = 'name';
    const uid = 'uid';
    const uhUuid = 'uhUuid';

    it('should render the name', () => {
        render(<GroupingMemberNameCell name={name} uid={uid} uhUuid={uhUuid} />);
        expect(screen.getByText(name)).toBeInTheDocument();
    });

    it('should render the departmental account icon', () => {
        const { rerender } = render(<GroupingMemberNameCell name={name} uid={''} uhUuid={''} />);
        expect(screen.getByLabelText('Departmental Account Icon')).toBeInTheDocument();

        rerender(<GroupingMemberNameCell name={name} uid={'testiwta'} uhUuid={'testiwta'} />);
        expect(screen.getByLabelText('Departmental Account Icon')).toBeInTheDocument();
    });
});
