import { getGroupingSyncDestinations } from '@/actions/groupings-api';
import SyncDestination from './sync-destination'; // Client component

const SyncDestinationsTab = async ({ params }: { params: { selectedGrouping: string } }) => {
    // Fetch the data
    const syncDestinations = await getGroupingSyncDestinations(params.selectedGrouping);

    // Ensure that syncDestinations is an array
    const syncDestArray = Array.isArray(syncDestinations) ? syncDestinations : [];

    // Process data: syncDestArray stores descriptions, tooltips store corresponding tooltips
    const processedSyncDestArray = syncDestArray.map(dest => ({
        name: dest.description,    // Checkbox label
        synced: dest.synced,       // Checkbox checked state
        hidden: dest.hidden        // Whether the item is hidden
    }));

    const tooltips = syncDestArray.reduce((acc, dest) => {
        acc[dest.description] = dest.tooltip; // Storing tooltips by description
        return acc;
    }, {});

    // Pass data to the client-side component
    return (
        <>
            <SyncDestination syncDestArray={processedSyncDestArray} tooltips={tooltips} />
        </>
    );
};

export default SyncDestinationsTab;

