import { MemberResult } from '@/lib/types';
import Role from './role';

type User = {
    roles: Role[];
} & MemberResult;

export const AnonymousUser: User = {
    name: '',
    firstName: '',
    lastName: '',
    uid: '',
    uhUuid: '',
    roles: [Role.ANONYMOUS] as const
};

export default User;
