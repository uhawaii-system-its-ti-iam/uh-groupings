import { groupingSyncDest } from '@/lib/fetchers';
import SyncDestinations from '@/app/groupings/[groupingPath]/@tab/_components/sync-destinations';

const SyncDestinationsTab = async ({ params }: { params: { groupingPath: string } }) => {
    const syncDestinations = await groupingSyncDest(params.groupingPath);
    const syncDestArray = syncDestinations.syncDestinations;
    const processedSyncDestArray = syncDestArray.map(dest => ({
        name: dest.name,
        description: dest.description,
        synced: dest.synced,
        hidden: dest.hidden,
        tooltip: dest.tooltip,
    }));

    return (
        <SyncDestinations syncDestArray={processedSyncDestArray} groupingPath={params.groupingPath} />
    );
};

export default SyncDestinationsTab;

