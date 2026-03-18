'use server';

import { getDuplicateOwners } from '@/lib/actions';

interface DuplicateOwnersData {
    duplicateOwners: Record<string, { uhUuid: string; name: string; uid: string; paths: string[] }>;
    duplicateOwnersCount: number;
}

/**
 * Fetches duplicate owners data for a grouping path.
 * Handles decoding the grouping path and error handling.
 *
 * @param encodedGroupingPath - The URL-encoded grouping path from params
 * @returns Object containing duplicateOwners and duplicateOwnersCount
 */
export async function getDuplicateOwnersData(encodedGroupingPath: string): Promise<DuplicateOwnersData> {

    try {
        const decodedGroupingPath = decodeURIComponent(encodedGroupingPath);

        const result = await getDuplicateOwners(decodedGroupingPath);

        if (result && typeof result === 'object') {
            const duplicateOwnersCount = Object.keys(result).length;

            return {
                duplicateOwners: result,
                duplicateOwnersCount
            };
        }

        return {
            duplicateOwners: {},
            duplicateOwnersCount: 0
        };
    } catch (error) {
        console.error('Error fetching duplicate owners:', error);
        return {
            duplicateOwners: {},
            duplicateOwnersCount: 0
        };
    }
}
