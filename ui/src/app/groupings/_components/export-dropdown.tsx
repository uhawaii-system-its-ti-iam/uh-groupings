import { Button } from '@/components/ui/button';

const ExportDropdown = ({
                            paginatingComplete,
                            isGroupingEmpty,
                            groupingMembers,
                            groupingBasis,
                            groupingInclude,
                            groupingExclude,
                            exportGroupToCsv,
                            getCSVToolTipMessage
                        }) => (
    <div
        className="btn-group dropdown"
        id="csvButton"
        //tooltip
        data-original-title={getCSVToolTipMessage()}
    >
        <Button
            type="button"
            className="form-control"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            ng-disabled={!paginatingComplete || isGroupingEmpty()}
        >
            <i className="fa fa-file-export mr-1"></i>
            Export Grouping
            <i className="fa fa-caret-down ml-1"></i>
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

export default ExportDropdown;
