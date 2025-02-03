enum SortBy {
    NAME = 'name',
    UID = 'uid',
    UH_UUID = 'uhUuid'
}

export const findSortBy = (value: string): SortBy => Object.values(SortBy).find((v) => v === value) ?? SortBy.NAME;

export default SortBy;
