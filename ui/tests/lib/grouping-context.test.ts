import { describe, expect, it } from 'vitest';
import { isAdminContext } from '@/lib/grouping-context';

describe('isAdminContext', () => {
    it.each([
        ['', false],
        ['from=admin', true],
        ['from=groupings', false],
        ['from=unknown', false],
        ['from=admin&from=groupings', true],
        ['from=groupings&from=admin', true],
        ['from=&from=admin', true]
    ])('agrees for client and server values of "%s"', (query, expected) => {
        const params = new URLSearchParams(query);
        const values = params.getAll('from');
        const serverValue = values.length > 1 ? values : values[0];

        expect(isAdminContext(params.getAll('from'))).toBe(expected);
        expect(isAdminContext(serverValue)).toBe(expected);
    });
});
