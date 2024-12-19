import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BeforeLogin from '@/app/(home)/_components/before-login';

describe('BeforeLogin', () => {
    it('renders UHGroupingsInfo and a button with correct text and link', () => {
        const linkUrl = 'https://uhawaii.atlassian.net/wiki/spaces/UHIAM/pages/13403213/UH+Groupings';

        render(<BeforeLogin />);

        expect(screen.getByRole('heading', { name: 'What is a UH Grouping?' })).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', linkUrl);
        expect(screen.getByRole('button', { name: 'Learn More' })).toBeInTheDocument();
    });
});
