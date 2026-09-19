'use server';

import { getDuplicateOwners } from '@/lib/actions';

interface DuplicateOwnersData {
    duplicateOwners: Record<string, { uhUuid: string; name: string; uid: string; paths: string[] }>;
    duplicateOwnersCount: number;
}

function isDuplicateOwnersRecord(
    value: unknown
): value is DuplicateOwnersData['duplicateOwners'] {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const record = value as Record<string, unknown>;

    for (const key of Object.keys(record)) {
        const entry = record[key] as {
            uhUuid?: unknown;
            name?: unknown;
            uid?: unknown;
            paths?: unknown;
        };

        if (!entry || typeof entry !== 'object') {
            return false;
        }

        if (typeof entry.uhUuid !== 'string') {
            return false;
        }

        if (typeof entry.name !== 'string') {
            return false;
        }

        if (typeof entry.uid !== 'string') {
            return false;
        }

        if (!Array.isArray(entry.paths)) {
            return false;
        }

        if (!entry.paths.every((p) => typeof p === 'string')) {
            return false;
        }
    }

    return true;
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

        if (isDuplicateOwnersRecord(result)) {
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
