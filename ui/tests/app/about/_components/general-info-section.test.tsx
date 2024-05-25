import { render, screen } from '@testing-library/react';
import GeneralInfoSection from '@/app/about/_components/general-info-section';

describe('GeneralInfoSection', () => {
    it('should render with question and answer', () => {
        render(<GeneralInfoSection />);

        expect(screen.getByText('How do I request a new grouping?')).toBeInTheDocument();
        expect(screen.getByText('A request form is available.')).toBeInTheDocument();

        expect(screen.getByText('What is the Include members list?')).toBeInTheDocument();
        expect(screen.getByText('A grouping\'s Include is the portion of the grouping membership that is manually updated. It may be empty.')).toBeInTheDocument();

        expect(screen.getByText('Exactly what is a grouping?')).toBeInTheDocument();
        expect(screen.getByText('General information about groupings is available.')).toBeInTheDocument();
        expect(screen.getByText('A grouping\'s components include the Basis, Include, and Exclude lists.')).toBeInTheDocument();

        expect(screen.getByText('What is the Exclude members list?')).toBeInTheDocument();
        expect(screen.getByText('A grouping\'s Exclude overrides automatic and manual membership by explicitly not including anyone listed here. It may be empty.')).toBeInTheDocument();

        expect(screen.getByText('What is the Basis?')).toBeInTheDocument();
        expect(screen.getByText('A grouping\'s Basis is the portion of the grouping membership that is automatically updated. It may be empty.')).toBeInTheDocument();
    });
});
