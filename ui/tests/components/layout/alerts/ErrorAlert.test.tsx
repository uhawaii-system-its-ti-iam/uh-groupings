import { render, screen } from '@testing-library/react';
import ErrorAlert from "@/components/layout/alerts/ErrorAlert";

describe('ErrorAlert', () => {

    it('should render the Error Alert with the appropriate message', () => {
        render(<ErrorAlert/>);
        expect(screen.getByRole('heading', {name: 'Error'})).toBeInTheDocument();
        expect(screen.getByText('Email feedback was unsuccessful. Please try again.')).toBeInTheDocument();
    });
});
