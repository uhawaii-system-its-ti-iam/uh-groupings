'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileInput, ChevronDown } from 'lucide-react';

const ExportDropdown = () => {
    const [paginatingComplete, setPaginatingComplete] = useState(true);
    const [groupingMembers, setGroupingMembers] = useState([]);
    const [groupingBasis, setGroupingBasis] = useState([]);
    const [groupingInclude, setGroupingInclude] = useState([]);
    const [groupingExclude, setGroupingExclude] = useState([]);

    const isGroupingEmpty = () => {};
    const exportGroupToCsv = (group, type) => {
        console.log(`Exporting ${type}:`, group);
    };
    const getCSVToolTipMessage = () => {
        return 'Tooltip Message';
    };

    return (
        <div className="btn-group dropdown float-right" id="csvButton" data-original-title={getCSVToolTipMessage()}>
            <Button
                type="button"
                className="form-control"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                ng-disabled={!paginatingComplete || isGroupingEmpty()}
            >
                <FileInput className="mr-1" />
                Export Grouping
                <ChevronDown className="ml-1" />
            </Button>

            <div className="dropdown-menu dropdown-menu-right">
                {groupingMembers.length > 0 && (
                    <label className="dropdown-item" onClick={() => exportGroupToCsv(groupingMembers, 'members')}>
                        <i className="fa fa-users mr-1"></i>
                        Export All Members
                    </label>
                )}

                {groupingBasis.length > 0 && (
                    <label className="dropdown-item" onClick={() => exportGroupToCsv(groupingBasis, 'basis')}>
                        <i className="far fa-id-card mr-1"></i>
                        Export Basis
                    </label>
                )}

                {groupingInclude.length > 0 && (
                    <label className="dropdown-item" onClick={() => exportGroupToCsv(groupingInclude, 'include')}>
                        <i className="fas fa-user-plus mr-1"></i>
                        Export Include
                    </label>
                )}

                {groupingExclude.length > 0 && (
                    <label className="dropdown-item" onClick={() => exportGroupToCsv(groupingExclude, 'exclude')}>
                        <i className="fas fa-user-minus mr-1"></i>
                        Export Exclude
                    </label>
                )}
            </div>
        </div>
    );
};

export default ExportDropdown;
