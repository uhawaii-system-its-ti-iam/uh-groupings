'use client';

import { Button } from '@/components/ui/button';
import { FileInput, ChevronDown } from 'lucide-react';

const ExportDropdown = () => {
    return (
        <div className="btn-group dropdown float-right">
            <Button aria-label="Export Grouping">
                <FileInput className="mr-1" />
                Export Grouping
                <ChevronDown className="ml-1" />
            </Button>
        </div>
    );
};

export default ExportDropdown;
