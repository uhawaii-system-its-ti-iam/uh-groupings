'use server';

import {
    OotbActiveProfile,
    OotbActiveProfileResult
} from './types';
import {
    postRequest
} from './http-client';
import ootbProfiles from '../../ootb.active.user.profiles.json' assert { type: 'json' };

const profiles = ootbProfiles as OotbActiveProfile[];
const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;

/**
 * Updates the active default user based on the given name.
 * @param givenName - The given name to match with attributes.givenName.
 * @returns The matched OotbActiveProfile.
 * @throws Error if no matching profile is found.
 */
export const updateActiveDefaultUser = async (givenName: string | undefined): Promise<OotbActiveProfileResult> => {
    const matchedProfile = await matchProfile(givenName);
    const endpoint = `${baseUrl}/activeProfile/ootb`;
    return postRequest<OotbActiveProfileResult>(endpoint, matchedProfile.uid, matchedProfile);
};

/**
 * Matches a profile by the given name.
 * @param givenName - The given name to search for.
 * @returns The matched profile as OotbActiveProfile.
 * @throws Error if no profile matches the given name.
 */
export const matchProfile = async (givenName: string | undefined): Promise<OotbActiveProfile> => {
    const matchedProfile = profiles.find(profile => profile.attributes.givenName === givenName) as OotbActiveProfile;
    if (!matchedProfile) {
        throw new Error(`No profile found for givenName: ${givenName}`);
    }
    console.log('Matched Profile:', matchedProfile);
    return matchedProfile;
};
