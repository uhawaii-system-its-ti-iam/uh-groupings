import GroupingMemberUidCell from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/table-element/grouping-member-uid-cell';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('GroupingMemberUidCell', () => {
    const uid = 'uid';

    it('should render the uid', () => {
        render(<GroupingMemberUidCell uid={uid} />);
        expect(screen.getByText(uid)).toBeInTheDocument();
    });

    it('should render N/A if the uid is empty', () => {
        render(<GroupingMemberUidCell uid="" />);
        expect(screen.getByText('N/A')).toBeInTheDocument();
    });
});
