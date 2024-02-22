import { render, screen } from '@testing-library/react';
import SuccessAlert from "@/components/layout/alerts/SuccessAlert";

describe('SuccessAlert', () => {

    it('should render the Success Alert with the appropriate message', () => {
        render(<SuccessAlert/>);
        expect(screen.getByRole('heading', {name: 'Thank you!'})).toBeInTheDocument();
        expect(screen.getByText('Your feedback has successfully been submitted.')).toBeInTheDocument();
    });
});
