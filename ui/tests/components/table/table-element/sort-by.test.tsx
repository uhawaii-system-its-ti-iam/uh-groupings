import SortBy, {
    findSortBy
} from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/table-element/sort-by';
import { describe, expect, it } from 'vitest';

describe('SortBy', () => {
    describe('findSortBy', () => {
        it('should find the correct enum', () => {
            expect(findSortBy('name')).toBe(SortBy.NAME);
            expect(findSortBy('uid')).toBe(SortBy.UID);
            expect(findSortBy('uhUuid')).toBe(SortBy.UH_UUID);
        });

        it('should use the default enum SortBy.NAME', () => {
            expect(findSortBy('bogus')).toBe(SortBy.NAME);
        });
    });
});
