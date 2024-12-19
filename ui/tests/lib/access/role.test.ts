import { describe, it, expect } from 'vitest';
import Role from '@/lib/access/role';

describe('role', () => {
    it('should have the same key and value', () => {
        for (const [key, value] of Object.entries(Role)) {
            expect(key).toBe(value);
        }
    });
});
