import { MemberResult } from '@/lib/types';
import Role from './role';
import { CasUser } from 'next-cas-client';
import { setRoles } from './authorization';
import { getCurrentUser } from 'next-cas-client/app';
import { matchProfile, updateActiveDefaultUser } from '@/lib/actions-ootb';
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

export const loadOotbUser = async (profile: OotbActiveProfile): Promise<User> => {
    const user = {
        name: profile.attributes.cn,
        firstName: profile.attributes.givenName,
        lastName: profile.attributes.sn,
        uid: profile.uid,
        uhUuid: profile.uhUuid,
        roles: [Role.ANONYMOUS, ...convertAuthoritiesToRoles(profile.authorities)]
    } as User;

    return user;
};

const convertAuthoritiesToRoles = (authorities: string[]): Role[] => {
    return authorities.map(authority => authority.replace(/^ROLE_/, '').toUpperCase())
                      .filter(roleName => Object.values(Role).includes(roleName as Role))
                      .map(roleName => roleName as Role);
};


export const getUser = async (): Promise<User> => {
    if (process.env.NEXT_PUBLIC_OOTB_MODE === 'true') {
        const givenName = process.env.NEXT_PUBLIC_OOTB_PROFILE;
        try {
            await updateActiveDefaultUser(givenName);
            const profile = await matchProfile(givenName);
            return profile ? await loadOotbUser(profile) : AnonymousUser;
        } catch (error) {
            console.error('Error fetching OOTB user:', error);
            return AnonymousUser;
        }
    }
    const user = (await getCurrentUser<User>()) ?? AnonymousUser;
    return user;
};

export default User;
 