const PersonTableColumns = [
    {
        header: 'Grouping',
        accessorKey: 'name',
        enableHiding: false,
        sortDescFirst: true
    },
    {
        header: 'Owner?',
        accessorKey: 'inOwner',
        enableSorting: false,
        cell: ({ row }) => (
            <div className="ml-1">
                <p className={`${row.original.inOwner ? 'text-red-500' : ''}`}>{row.original.inOwner ? 'Yes' : 'No'}</p>
            </div>
        )
    },
    {
        header: 'Basis?',
        accessorKey: 'inBasisAndInclude',
        enableSorting: false,
        cell: ({ row }) => (
            <div>
                <p className={`${row.original.inBasisAndInclude ? 'text-red-500' : ''}`}>
                    {row.original.inBasisAndInclude ? 'Yes' : 'No'}
                </p>
            </div>
        )
    },
    {
        header: 'Include?',
        accessorKey: 'inInclude',
        enableSorting: false,
        cell: ({ row }) => (
            <div className="ml-2">
                <p className={`${row.original.inInclude ? 'text-red-500' : ''}`}>
                    {row.original.inInclude ? 'Yes' : 'No'}
                </p>
            </div>
        )
    },
    {
        header: 'Exclude?',
        accessorKey: 'inExclude',
        enableSorting: false,
        cell: ({ row }) => (
            <div className="ml-2">
                <p className={`${row.original.inExclude ? 'text-red-500' : ''}`}>
                    {row.original.inExclude ? 'Yes' : 'No'}
                </p>
            </div>
        )
    },
    {
        header: 'Remove',
        accessorKey: 'remove',
        enableSorting: false,
        cell: ({ row }) => (
            <div className="ml-3">
                <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()}
                       data-testid={'person-remove'} />
            </div>
        )
    }
];

export default PersonTableColumns;
