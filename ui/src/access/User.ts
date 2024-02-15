import { MemberResult } from '@/services/GroupingsApiResults';
import Role from './Role';

type User = {
    roles: Role[]
} & MemberResult

export const AnonymousUser: User = {
    name: '',
    firstName: '',
    lastName: '',
    uid: '',
    uhUuid: '',
    roles: [Role.ANONYMOUS] as const
}

export default User;
