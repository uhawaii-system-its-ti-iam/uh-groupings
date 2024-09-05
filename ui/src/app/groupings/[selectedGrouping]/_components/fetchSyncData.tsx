'use server';

import React from 'react';
import SyncDestinations from './sync-destinations'; //
import { getGroupingSyncDestinations } from '@/actions/groupings-api';  //

// 服务器端操作，用于获取数据
export async function fetchSyncDestinations(groupingPath) {
    try {
        const { resultCode, result } = await getGroupingSyncDestinations(groupingPath);
        if (resultCode === 'SUCCESS') {
            console.log('Fetched sync destinations:', result); // Log to confirm fetched data
            return result.syncDestinations || [];
        } else {
            console.error('Failed to fetch sync destinations:', resultCode);
            return [];
        }
    } catch (error) {
        console.error('Error fetching sync destinations:', error);
        return [];
    }
}


export default async function SyncDestinationsPage({ params }) {
    const groupingPath = params.groupingPath; // Assume this comes from the URL or context
    const syncDestinations = await fetchSyncDestinations(groupingPath); // Fetch data server-side

    return <SyncDestinations syncDestinations={syncDestinations} />;
}