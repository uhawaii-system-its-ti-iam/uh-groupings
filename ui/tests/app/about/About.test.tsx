import { render, screen } from '@testing-library/react';
import About from '@/app/about/page';

describe('About', () => {

    it('should render the About page with the appropriate headers, images and links', () => {
        render(<About/>);
        expect(screen.getByRole('main')).toBeInTheDocument();

        expect(screen.getByText('What is a UH Grouping?')).toBeInTheDocument();
        expect(screen.getByRole('img', {name: 'Cogs icon'})).toBeInTheDocument();
        expect(screen.getByRole('img', {name: 'Email icon'})).toBeInTheDocument();
        expect(screen.getByRole('img', {name: 'Watch icon'})).toBeInTheDocument();

        expect(screen.getByText('GENERAL INFO')).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'A request form is available'}))
            .toHaveAttribute('href', 'https://uhawaii.atlassian.net/wiki/spaces/UHIAM/pages/13402308/UH+Groupings+Request+Form');
        expect(screen.getByRole('link', {name: 'General information about groupings is available'}))
            .toHaveAttribute('href', 'https://uhawaii.atlassian.net/wiki/spaces/UHIAM/pages/13403213/UH+Groupings');

        expect(screen.getByText('WHAT HAPPENS IF')).toBeInTheDocument();

        expect(screen.getByText('TECHNICAL INFORMATION')).toBeInTheDocument();
        expect(screen.getByText('Resources')).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'GitHub'}))
            .toHaveAttribute('href', 'https://github.com/uhawaii-system-its-ti-iam/uh-groupings');

        expect(screen.getByText('Technologies')).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'Link to React.js Quickstart'}))
            .toHaveAttribute('href', 'https://react.dev/learn');
        expect(screen.getByRole('link', {name: 'Link to Next.js Introduction'}))
            .toHaveAttribute('href', 'https://nextjs.org/docs');
        expect(screen.getByRole('link', {name: 'Link to Typescript Guide'}))
            .toHaveAttribute('href', 'https://www.typescriptlang.org/docs/');
        expect(screen.getByRole('link', {name: 'Link to Tailwind CSS Guide'}))
            .toHaveAttribute('href', 'https://v2.tailwindcss.com/docs');

        expect(screen.getByRole('link', {name: 'Link to shadcn/ui Guide'}))
            .toHaveAttribute('href', 'https://ui.shadcn.com/docs');
        expect(screen.getByRole('link', {name: 'Link to Tanstack Table Introduction'}))
            .toHaveAttribute('href', 'https://tanstack.com/table/v8/docs/introduction');
        expect(screen.getByRole('link', {name: 'Link to Tanstack Query Guide'}))
            .toHaveAttribute('href', 'https://tanstack.com/query/latest/docs/framework/react/overview');

        expect(screen.getByRole('link', {name: 'Link to Iron Session GitHub'}))
            .toHaveAttribute('href', 'https://github.com/vvo/iron-session');
        expect(screen.getByRole('link', {name: 'Link to Jest Introduction'}))
            .toHaveAttribute('href', 'https://jestjs.io/docs/getting-started');
        expect(screen.getByRole('link', {name: 'Link to React Testing Library Documentation'}))
            .toHaveAttribute('href', 'https://testing-library.com/');
    });
});
