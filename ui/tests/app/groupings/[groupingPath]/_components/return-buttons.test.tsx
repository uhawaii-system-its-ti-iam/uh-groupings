import { render, screen } from '@testing-library/react';
import ReturnButtons from '@/app/groupings/[groupingPath]/_components/return-buttons';

describe('ReturnButtons Component', () => {
    test('renders button to return to Groupings List when fromManageSubject is false', () => {
        render(<ReturnButtons fromManageSubject={false} />);

        expect(screen.getByText(/return to groupings list/i)).toBeInTheDocument();
        expect(screen.queryByText(/return to manage person/i)).not.toBeInTheDocument();
    });

    test('renders button to return to Manage Person when fromManageSubject is true', () => {
        render(<ReturnButtons fromManageSubject={true} />);

        expect(screen.getByText(/return to manage person/i)).toBeInTheDocument();
        expect(screen.queryByText(/return to groupings list/i)).not.toBeInTheDocument();
    });
});
