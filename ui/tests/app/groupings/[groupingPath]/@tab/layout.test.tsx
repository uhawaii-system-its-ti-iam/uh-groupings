import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TabLayout from '@/app/groupings/[groupingPath]/@tab/layout';

describe('TabLayout', () => {
    it('renders children', () => {
        const testContent = <div>Test Child Content</div>;
        render(<TabLayout>{testContent}</TabLayout>);
        expect(screen.getByText('Test Child Content')).toBeInTheDocument();
    });
});
