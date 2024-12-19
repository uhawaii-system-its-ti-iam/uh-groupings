import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/footer';

describe('Footer', () => {
    it('should render a footer with the UH System logo and appropriate links', () => {
        render(<Footer />);

        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'UH System logo' })).toHaveAttribute(
            'src',
            '/uhgroupings/uh-logo-system.svg'
        );
        expect(
            screen.getByRole('link', {
                name: 'equal opportunity/affirmative action institution'
            })
        ).toHaveAttribute('href', 'https://www.hawaii.edu/offices/eeo/policies/?policy=antidisc');
        expect(screen.getByRole('link', { name: 'Usage Policy' })).toHaveAttribute(
            'href',
            'https://www.hawaii.edu/policy/docs/temp/ep2.210.pdf'
        );
    });
});
