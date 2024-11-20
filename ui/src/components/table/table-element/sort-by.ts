enum SortBy {
    NAME = 'name',
    UID = 'uid',
    UH_UUID = 'uhUuid'
}

export const findSortBy = (value: string): SortBy => {
    return Object.values(SortBy).find((v) => v === value) ?? SortBy.NAME;
};

// TODO: Remove mapSortBy after GROUPINGS-1840 is complete
export const mapSortBy = (sortBy: string) => {
    switch (sortBy) {
        case 'uid':
            return 'search_string0';
        case 'uhUuid':
            return 'subjectId';
        default:
            return 'name';
    }
};

export default SortBy;
