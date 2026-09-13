import { describe, expect, it } from 'vitest';
import { getLoginCallbackURL, getSafeCallbackURL, isProtectedPath } from '@/lib/auth-navigation';

describe('authentication navigation', () => {
    it('retains an in-app protected destination after login', () => {
        expect(getLoginCallbackURL('http://localhost:8080/uhgroupings/?callbackURL=%2Fuhgroupings%2Fadmin%3Ftab%3Dusers'))
            .toBe('/uhgroupings/admin?tab=users');
    });

    it('uses the current in-app URL when middleware did not supply a destination', () => {
        expect(getLoginCallbackURL('http://localhost:8080/uhgroupings/groupings?tab=members'))
            .toBe('/uhgroupings/groupings?tab=members');
    });

    it('rejects external and protocol-relative callback URLs', () => {
        expect(getSafeCallbackURL('https://example.test')).toBe('/uhgroupings/');
        expect(getSafeCallbackURL('//example.test')).toBe('/uhgroupings/');
        expect(getSafeCallbackURL('/admin')).toBe('/uhgroupings/');
    });

    it('recognizes only application protected routes', () => {
        expect(isProtectedPath('/uhgroupings/groupings/example')).toBe(true);
        expect(isProtectedPath('/uhgroupings/about')).toBe(false);
    });
});
