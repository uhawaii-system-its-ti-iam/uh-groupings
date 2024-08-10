import { render, screen } from '@testing-library/react';
import TechnicalInfoSection from '@/app/about/_components/technical-info-section';

describe('TechnicalInfoSection', () => {
    it('should render with name, url, and description', () => {
        render(<TechnicalInfoSection />);

        const guideLinks = screen.getAllByText('(Guide)');
        const introductionLinks = screen.getAllByText('(Introduction)');

        expect(screen.getByText('React.js')).toBeInTheDocument();
        expect(screen.getByText('(Quickstart)')).toBeInTheDocument();
        expect(screen.getByText('(Quickstart)')).toHaveAttribute(
            'href',
            'https://react.dev/learn'
        );

        expect(screen.getByText('shadcn/ui')).toBeInTheDocument();
        expect(guideLinks[0]).toBeInTheDocument();
        expect(guideLinks[0]).toHaveAttribute(
            'href',
            'https://ui.shadcn.com/docs'
        );

        expect(screen.getByText('Jest')).toBeInTheDocument();
        expect(introductionLinks[0]).toBeInTheDocument();
        expect(introductionLinks[0]).toHaveAttribute(
            'href',
            'https://jestjs.io/docs/getting-started'
        );

        expect(screen.getByText('Next.js')).toBeInTheDocument();
        expect(introductionLinks[1]).toBeInTheDocument();
        expect(introductionLinks[1]).toHaveAttribute(
            'href',
            'https://nextjs.org/docs'
        );

        expect(screen.getByText('Tanstack Table')).toBeInTheDocument();
        expect(introductionLinks[2]).toBeInTheDocument();
        expect(introductionLinks[2]).toHaveAttribute(
            'href',
            'https://tanstack.com/table/v8/docs/introduction'
        );

        expect(screen.getByText('React Testing Library')).toBeInTheDocument();
        expect(screen.getByText('(Documentation)')).toBeInTheDocument();
        expect(screen.getByText('(Documentation)')).toHaveAttribute(
            'href',
            'https://testing-library.com/'
        );

        expect(screen.getByText('Typescript')).toBeInTheDocument();
        expect(guideLinks[1]).toBeInTheDocument();
        expect(guideLinks[1]).toHaveAttribute(
            'href',
            'https://www.typescriptlang.org/docs/'
        );

        expect(screen.getByText('Tanstack Query')).toBeInTheDocument();
        expect(guideLinks[2]).toBeInTheDocument();
        expect(guideLinks[2]).toHaveAttribute(
            'href',
            'https://tanstack.com/query/latest/docs/framework/react/overview'
        );

        expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
        expect(guideLinks[3]).toBeInTheDocument();
        expect(guideLinks[3]).toHaveAttribute(
            'href',
            'https://v2.tailwindcss.com/docs'
        );

        expect(screen.getByText('Iron Session')).toBeInTheDocument();
        expect(screen.getByText('(GitHub)')).toBeInTheDocument();
        expect(screen.getByText('(GitHub)')).toHaveAttribute(
            'href',
            'https://github.com/vvo/iron-session'
        );
    });
});
