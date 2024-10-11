const PersonTableColumns = [
    {
        header: 'Grouping',
        accessorKey: 'name',
        enableHiding: false,
        sortDescFirst: true
    },
    {
        header: 'Owner?',
        accessorKey: 'owner'
    },
    {
        header: 'Basis?',
        accessorKey: 'basis'
    },
    {
        header: 'Include?',
        accessorKey: 'include'
    },
    {
        header: 'Exclude?',
        accessorKey: 'exclude'
    },
    {
        header: 'Remove',
        accessorKey: 'remove'
    }
];

export default PersonTableColumns;
