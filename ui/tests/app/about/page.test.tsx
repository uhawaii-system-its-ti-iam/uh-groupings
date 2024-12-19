import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '@/app/about/page';

describe('About', () => {
    it('should render the headers GENERAL INFORMATION, WHAT HAPPENS IF, and TECHNICAL INFORMATION', () => {
        render(<About />);
        expect(screen.getByText('GENERAL INFORMATION')).toBeInTheDocument();
        expect(screen.getByText('WHAT HAPPENS IF')).toBeInTheDocument();
        expect(screen.getByText('TECHNICAL INFORMATION')).toBeInTheDocument();
    });
});
