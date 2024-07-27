import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DescriptionForm from '@/app/groupings/[selectedGrouping]/_components/description-form';
import { updateDescription } from '@/lib/actions';

jest.mock('@/lib/actions', () => ({
    updateDescription: jest.fn(),
}));

describe('DescriptionForm', () => {

    const groupDescription = 'test description';
    const groupPath = 'test path';

    it('should render description', () => {
        render(<DescriptionForm groupDescription={groupDescription} groupPath={groupPath} />);
        expect(screen.getByText(/Description:/)).toBeTruthy();
        expect(screen.getByText(groupDescription)).toBeTruthy();
    });

    it('toggles form visibility on edit button click', () => {
        render(<DescriptionForm groupDescription={groupDescription} groupPath={groupPath} />);

        const editButton = screen.getByRole('button', { name: /edit/i });
        fireEvent.click(editButton);
        expect(screen.getByPlaceholderText(/Description/i)).toBeTruthy();

        const closeButton = screen.getByRole('button', { name: /times-circle/i });
        fireEvent.click(closeButton);
        expect(screen.queryByPlaceholderText(/Description/i)).toBeNull();
    });

    it('submits form and updates description', async () => {
        render(<DescriptionForm groupDescription={groupDescription} groupPath={groupPath} />);

        const editButton = screen.getByRole('button', { name: /edit/i });
        fireEvent.click(editButton);

        const input = screen.getByPlaceholderText(/Description/i);
        fireEvent.change(input, { target: { value: 'Update Description' } });

        const submitButton = screen.getByRole('button', { name: /circle-check/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(updateDescription).toHaveBeenCalledWith('Update Description', groupPath);
        });

        expect(screen.queryByPlaceholderText(/Description/i)).toBeNull();
    });

    it('displays alert when description exceeds max length', async () => {
        render(<DescriptionForm groupDescription={groupDescription} groupPath={groupPath} />);

        const editButton = screen.getByRole('button', { name: /edit/i });
        fireEvent.click(editButton);

        const input = screen.getByPlaceholderText(/Description/i);
        fireEvent.change(input, { target: { value: 'a'.repeat(99) } });

        const alert = await screen.findByTestId('description-alert');
        expect(alert).toBeInTheDocument();
    });
});
