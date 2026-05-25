/**
 * Sort keys supported by the grouping-members table API.
 * Mirrors the Groupings API `sortBy` query parameter values.
 */
enum SortBy {
    NAME = 'name',
    UID = 'uid',
    UH_UUID = 'uhUuid'
}

/**
 * Resolve an arbitrary string to a known {@link SortBy} value, defaulting to
 * {@link SortBy.NAME} when the input is not recognized.
 */
export const findSortBy = (value: string): SortBy =>
    Object.values(SortBy).find((v) => v === value) ?? SortBy.NAME;

export default SortBy;

