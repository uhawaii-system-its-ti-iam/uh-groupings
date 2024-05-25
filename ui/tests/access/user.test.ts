import Role from '@/access/role';
import { AnonymousUser } from '@/access/user';

describe('user', () => {

    describe('AnonymousUser', () => {
        
        it('should only have the Role ANONYMOUS', () => {
            expect(AnonymousUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(AnonymousUser.roles.includes(Role.UH)).toBeFalsy();
            expect(AnonymousUser.roles.includes(Role.ADMIN)).toBeFalsy();
            expect(AnonymousUser.roles.includes(Role.OWNER)).toBeFalsy();
        });

    });

});
