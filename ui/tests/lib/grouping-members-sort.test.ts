import SortBy, {
    findSortBy
} from '@/lib/grouping-members-sort';
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
