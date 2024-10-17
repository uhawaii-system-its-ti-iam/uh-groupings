import { render, screen, fireEvent } from '@testing-library/react';
import ReturnButtons from '@/app/groupings/[selectedGrouping]/_components/return-buttons';
import { useRouter } from 'next/navigation';

type MockRouter = {
    push: jest.Mock;
};

describe('ReturnButtons Component', () => {
    const mockPush = jest.fn();
    const mockRouter: MockRouter = { push: mockPush };

    beforeEach(() => {
        mockPush.mockClear();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        sessionStorage.clear();
    });

    it('should render return to groupings list button when fromPage is not manage-person', () => {
        sessionStorage.setItem('fromPage', 'groupings');

        render(<ReturnButtons />);

        const button = screen.getByRole('button', { name: /Return to Groupings List/i });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockPush).toHaveBeenCalledWith('/groupings');
    });

    it('should render return to manage person button when fromPage is manage-person', () => {
        sessionStorage.setItem('fromPage', 'manage-person');

        render(<ReturnButtons />);

        const button = screen.getByRole('button', { name: /Return to Manage Person/i });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockPush).toHaveBeenCalledWith('/manage-person');
    });
});
