import { render, screen } from '@testing-library/react';
import WhatHappensIfSection from '@/app/about/_components/what-happens-if-section';

describe('WhatHappensIfSection', () => {
    it('should render with question and answer', () => {
        render(<WhatHappensIfSection />);

        expect(screen.getByText('Q: I was an owner of just one grouping and someone (me or another owner) deleted my ownership while I was still logged in.')).toBeInTheDocument();
        expect(screen.getByText('A: You will still see the Groupings menu option, but you will get an error message when you click on it. Next time you log in, the Groupings menu option will no longer appear, assuming that you don\'t reacquire the ownership of a grouping before then.')).toBeInTheDocument();

        expect(screen.getByText('Q: I was not an owner of any groupings and someone made me an owner while I was still logged in.')).toBeInTheDocument();
        expect(screen.getByText('A: You will have to log out and then log back in again to see the Groupings menu option.')).toBeInTheDocument();

        expect(screen.getByText('Q: I was an admin and someone (me or another admin) deleted my admin role while I was still logged in.')).toBeInTheDocument();
        expect(screen.getByText('A: You will still see the Admin menu option, but you will get an error message when you click on it. Next time you log in, the Admin menu option will no longer appear, assuming that you don\'t reacquire the Admin role before then.')).toBeInTheDocument();
    });
});
