import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GeneralInfoSection from '@/app/about/_components/general-info-section';

describe('GeneralInfoSection', () => {
    it('should render with question and answer', () => {
        render(<GeneralInfoSection />);

        expect(screen.getAllByText('?', { exact: false }).length).toBe(5);
    });
});
