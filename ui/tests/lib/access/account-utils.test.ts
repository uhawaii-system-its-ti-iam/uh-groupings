import { describe, expect, it } from 'vitest';
import { isDepartmental } from '@/lib/access/account-utils';

describe('isDepartmental', () => {
    it.each([
        ['99997010', '99997010', true],
        ['department', '', true],
        ['person', '99997010', false],
        ['', '', true]
    ])('classifies uid=%s and uhUuid=%s as departmental=%s', (uid, uhUuid, expected) => {
        expect(isDepartmental(uid, uhUuid)).toBe(expected);
    });
});
