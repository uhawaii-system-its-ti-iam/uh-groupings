import { describe, it, expect } from 'vitest';
import Heading from '@/components/layout/heading';
import { render, screen } from '@testing-library/react';

describe('Heading', () => {
    it('should render the title, description, and children', () => {
        const title = 'title';
        const description = 'description';
        const children = 'Hello World!';

        render(
            <Heading title={title} description={description}>
                {children}
            </Heading>
        );

        expect(screen.getByRole('heading', { name: 'title' })).toHaveTextContent(title);
        expect(screen.getByText(description)).toBeInTheDocument();
        expect(screen.getByText(children)).toBeInTheDocument();
    });
});
