import { render, screen } from '@testing-library/react';
import ActionsTab from '@/app/groupings/[selectedGrouping]/@tab/actions/page';

describe('ActionsTab', () => {
    it('renders Actions tab', () => {
        render(<ActionsTab />);
        const heading = screen.getByRole('heading', { name: /actions/i });
        expect(heading).toBeInTheDocument();
    });
});
