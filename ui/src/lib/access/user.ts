import { MemberResult } from '@/lib/types';
import Role from './role';
import { CasUser } from 'next-cas-client';
import { setRoles } from './authorization';
import { getCurrentUser } from 'next-cas-client/app';
import { getOotbCurrentUser, matchProfile, updateActiveDefaultUser } from '@/lib/actions-ootb';
import { OotbActiveProfile } from '../types';
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

export const loadOotbUser = async (profile: OotbActiveProfile): Promise<User> => {
    console.log('Loading OOTB user:', profile);

    const roles: Role[] = [Role.ANONYMOUS];

    if (Array.isArray(profile.authorities)) {
        const mappedRoles = profile.authorities
            .map((authority) => {
                const roleName = authority.replace(/^ROLE_/, '');
                return roleName.toUpperCase();
            })
            .filter((roleName) => Object.values(Role).includes(roleName as Role))
            .map((roleName) => roleName as Role);
        roles.push(...mappedRoles);
    }

    const user = {
        name: profile.attributes.cn,
        firstName: profile.attributes.givenName,
        lastName: profile.attributes.sn,
        uid: profile.uid,
        uhUuid: profile.uhUuid,
        roles: roles
    } as User;

    console.log('OOTB user after setRoles:', user);
    return user;
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
    console.log('CAS user after setRoles:', user);
    return user;
};

export const getUser = async (): Promise<User> => {
    if (process.env.NEXT_PUBLIC_OOTB_MODE === 'true') {
        const givenName = process.env.NEXT_PUBLIC_OOTB_PROFILE;
        await updateActiveDefaultUser(givenName);
        const profile = await matchProfile(givenName);
        return profile ? await loadOotbUser(profile) : AnonymousUser;
    }
    const user = (await getCurrentUser<User>()) ?? AnonymousUser;
    return user;
};

export default User;
 