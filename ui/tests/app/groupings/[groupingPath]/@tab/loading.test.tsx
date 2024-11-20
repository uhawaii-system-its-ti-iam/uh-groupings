import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TabLoading from '@/app/groupings/[groupingPath]/@tab/loading';
import * as NextNavigation from 'next/navigation';

vi.mock('next/navigation');

describe('TabLoading', () => {
    const group = 'include';

    it('should render the GroupingsMembersTableSkeleton with the appropriate gorup', () => {
        vi.spyOn(NextNavigation, 'usePathname').mockReturnValue(
            `/uhgroupings/groupings/tmp:testiwta:testiwta-aux/${group}`
        );

        render(<TabLoading />);

        expect(screen.getByRole('heading', { name: group })).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });
});
