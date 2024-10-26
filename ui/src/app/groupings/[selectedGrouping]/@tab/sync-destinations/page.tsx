import { getGroupingSyncDestinations } from '@/actions/groupings-api';
import SyncDestination from './sync-destination'; // Client component

const SyncDestinationsTab = async ({ params }: { params: { selectedGrouping: string } }) => {
    // Fetch the data
    const syncDestinations = await getGroupingSyncDestinations(params.selectedGrouping);


    // Extract the array from data.
    const syncDestArray = Array.isArray(syncDestinations.syncDestinations) ? syncDestinations.syncDestinations : [];
    // Process the data
    const processedSyncDestArray = syncDestArray.map(dest => ({
        name: dest.description,    // Checkbox label
        synced: dest.synced,       // Checkbox checked state
        hidden: dest.hidden,        // Whether the item is hidden
        tooltip: dest.tooltip,
    }));


    // Pass the processedSyncDestArray and tooltips to the client-side component
    return (
        <>
            <SyncDestination syncDestArray={processedSyncDestArray} />
        </>
    );
};

export default SyncDestinationsTab;
