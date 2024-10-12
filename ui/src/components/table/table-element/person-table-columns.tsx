const PersonTableColumns = [
    {
        header: 'Grouping',
        accessorKey: 'name',
        enableHiding: false,
        sortDescFirst: true
    },
    {
        header: 'Owner?',
        accessorKey: 'inOwner'
    },
    {
        header: 'Basis?',
        accessorKey: 'inBasisAndInclude'
    },
    {
        header: 'Include?',
        accessorKey: 'inInclude'
    },
    {
        header: 'Exclude?',
        accessorKey: 'inExclude'
    },
    {
        header: 'Remove',
        accessorKey: 'remove'
    }
];

export default PersonTableColumns;
