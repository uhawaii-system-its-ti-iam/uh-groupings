import { render, screen } from '@testing-library/react';
import Feedback from "@/app/feedback/page";
import userEvent from '@testing-library/user-event'

describe('Feedback', () => {
  it('should render the Feedback form', async () => {
    render(<Feedback />);
    expect(screen.getByRole('heading', {name: 'Feedback'})).toBeInTheDocument();
    expect(screen.getByText('Helps us to understand where improvements are needed. Please let us know.')).toBeInTheDocument();
    expect(screen.getByText('Feedback Type:')).toBeInTheDocument();
    expect(screen.getByText('Your Name (Optional):')).toBeInTheDocument();
    expect(screen.getByText('Email Address:')).toBeInTheDocument();
    expect(screen.getByText('Your Feedback:')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Submit'})).toBeInTheDocument();
  });

  it('should see the success alert after submission', async() => {
    const user = userEvent.setup()
    render(<Feedback />);
    expect(screen.getByText('Feedback Type:')).toBeInTheDocument();
    expect(screen.getByText('Your Name (Optional):')).toBeInTheDocument();
    expect(screen.getByText('Email Address:')).toBeInTheDocument();
    expect(screen.getByText('Your Feedback:')).toBeInTheDocument();
    await user.type(screen.getByText('Feedback Type:'), 'General');
    await user.type(screen.getByText('Your Name (Optional):'), 'John Doe');
    await user.type(screen.getByText('Email Address:'), 'test@example.com');
    await user.type(screen.getByText('Your Feedback:'), 'This is a test feedback message.');
    await user.click(screen.getByRole('button', {name: 'Submit'}));

    // Wait for the success alert to appear
    await screen.findByText('Your feedback has successfully been submitted.');
    expect(screen.getByText('Your feedback has successfully been submitted.')).toBeInTheDocument();
  });

  it('should see the error alert after submission', async() => {
    const user = userEvent.setup()
    render(<Feedback />);
    expect(screen.getByText('Feedback Type:')).toBeInTheDocument();
    expect(screen.getByText('Your Name (Optional):')).toBeInTheDocument();
    expect(screen.getByText('Email Address:')).toBeInTheDocument();
    expect(screen.getByText('Your Feedback:')).toBeInTheDocument();
    await user.type(screen.getByText('Feedback Type:'), 'General');
    await user.type(screen.getByText('Your Name (Optional):'), 'John Doe');
    await user.type(screen.getByText('Email Address:'), 'test@example.com');
    await user.type(screen.getByText('Your Feedback:'), 'Short message.');
    await user.click(screen.getByRole('button', {name: 'Submit'}));

    // Wait for the error alert to appear
    await screen.findByText('Email feedback was unsuccessful. Please try again.');
    expect(screen.getByText('Email feedback was unsuccessful. Please try again.')).toBeInTheDocument();
  });
});

