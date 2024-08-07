import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GroupingPathCell from "@/components/table/table-element/GroupingPathCell";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
    if (!navigator.clipboard) {
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: jest.fn(() => Promise.resolve()),
            },
            writable: true,
        });
    } else {
        jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => Promise.resolve());
    }
});

describe('GroupingPathCell', () => {
    const data = 'tmp:example:example-aux';
    const uniqueId = "1";

    it('renders the component with correct data and clipboard button', async () => {
        render(<GroupingPathCell data={data} uniqueId={uniqueId} />);
        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveValue(data);

        const clipboardButton = screen.getByRole('button');
        expect(clipboardButton).toBeInTheDocument();
        expect(screen.getByTestId(`clipboard-icon-${uniqueId}`)).toBeInTheDocument();

        await waitFor(() => {
            userEvent.hover(clipboardButton);
            expect(screen.getAllByText('copy')[0]).toBeInTheDocument();
        })
    });

    it('shows tooltip correctly when copying to clipboard', async () => {
        render(<GroupingPathCell data={data} uniqueId={uniqueId} />);
        const clipboardButton = screen.getByRole('button');

        // Verify clipboard action and tooltip appearance
        fireEvent.click(clipboardButton);
        await waitFor(() => {
            expect(screen.getAllByText('copied!')[0]).toBeInTheDocument();
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(data);
        });

        // Wait for the 'copied!' text to disappear
        await waitFor(() => {
            expect(screen.queryByText('copied!')).not.toBeInTheDocument();
        }, { timeout: 2000 });

        // Check the 'copy' text appears again
        await userEvent.hover(clipboardButton);
        await waitFor(() => {
            expect(screen.getAllByText('copy')[0]).toBeInTheDocument();
        })

    });
});
