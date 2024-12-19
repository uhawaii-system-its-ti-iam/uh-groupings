import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WhatHappensIfSection from '@/app/about/_components/what-happens-if-section';

describe('WhatHappensIfSection', () => {
    it('should render with question and answer', () => {
        render(<WhatHappensIfSection />);

        screen.getAllByRole('heading', { level: 3 }).forEach((h3) => {
            expect(h3).toHaveTextContent('Q:');
        });
        expect(screen.getAllByText('A: ', { exact: false }).length).toBe(3);
    });
});
