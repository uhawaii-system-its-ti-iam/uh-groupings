import { MemberResult } from '@/lib/types';
import Role from './role';
import { CasUser } from 'next-cas-client';
import { setRoles } from './authorization';
import { getCurrentUser } from 'next-cas-client/app';

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

export const loadUser = async (casUser: CasUser): Promise<User> => {
    const user = {
        name: casUser.attributes.cn,
        firstName: casUser.attributes.givenName,
        lastName: casUser.attributes.sn,
        uid: casUser.attributes.uid,
        uhUuid: casUser.attributes.uhUuid,
        roles: []
    } as User;

    await setRoles(user);
    return user;
};

export const getUser = async (): Promise<User> => (await getCurrentUser<User>()) ?? AnonymousUser;

export default User;
