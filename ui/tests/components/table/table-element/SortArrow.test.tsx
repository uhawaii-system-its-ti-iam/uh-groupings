import { render, screen } from '@testing-library/react';
import SortArrow from '@/components/table/table-element/SortArrow';

describe('SortArrow', ()=>{

    it('render ChevronUp icon when direction is "asc"', () => {
        render(<SortArrow direction={'asc'}/>);
        expect(screen.getByTestId('chevron-up-icon'));
    });

    it('render ChevronDown icon when direction is "desc"', () => {
        render(<SortArrow direction={'desc'}/>);
        expect(screen.getByTestId('chevron-down-icon') );
    });

    it('render nothing when direction is not provide', () => {
        render(<SortArrow direction={'undefined'}/>);

        expect(screen.queryByTestId('chevron-up-icon') ).toBeNull();
        expect(screen.queryByTestId('chevron-down-icon') ).toBeNull();
    });

});

