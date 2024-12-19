import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GroupingHeader from '@/app/groupings/[groupingPath]/_components/grouping-header';
import DescriptionForm from '@/app/groupings/[groupingPath]/_components/description-form';

vi.mock('@/app/groupings/[groupingPath]/_components/description-form');

describe('GroupingHeader Component', () => {
    const GroupName = 'Test Group';
    const GroupDescription = 'Test Description';
    const GroupPath = 'Test Path';

    it('should render group name and group path', () => {
        render(<GroupingHeader groupName={GroupName} groupDescription={GroupDescription} groupPath={GroupPath} />);

        expect(screen.getByText(GroupName)).toBeTruthy();

        expect(screen.getByText(/Path:/)).toBeTruthy();
        expect(screen.getByText(GroupPath)).toBeTruthy();
    });

    it('should render DescriptionForm', () => {
        render(<GroupingHeader groupName={GroupName} groupDescription={GroupDescription} groupPath={GroupPath} />);

        expect(DescriptionForm).toHaveBeenCalledWith({ groupDescription: GroupDescription, groupPath: GroupPath }, {});
    });
});
