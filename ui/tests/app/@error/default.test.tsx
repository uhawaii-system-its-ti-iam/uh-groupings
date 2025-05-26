import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Default from '@/app/@error/default';

describe('Default Parallel Route Slot', () => {
    it('renders null without error', () => {
        const { container } = render(<Default />);
        expect(container.firstChild).toBeNull();
    });
});
