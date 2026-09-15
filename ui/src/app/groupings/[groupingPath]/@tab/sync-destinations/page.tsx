import { groupingSyncDest } from '@/lib/fetchers';
import SyncDestinations from '@/app/groupings/[groupingPath]/@tab/_components/sync-destinations';

const SyncDestinationsTab = async ({ params }: { params: Promise<{ groupingPath: string }> }) => {
    const { groupingPath } = await params;
    const syncDestinations = await groupingSyncDest(groupingPath);
    const syncDestArray = syncDestinations.syncDestinations;
    const processedSyncDestArray = syncDestArray.map(dest => ({
        name: dest.name,
        description: dest.description,
        synced: dest.synced,
        hidden: dest.hidden,
        tooltip: dest.tooltip,
    }));

    return (
        <SyncDestinations syncDestArray={processedSyncDestArray} groupingPath={groupingPath} />
    );
};

export default SyncDestinationsTab;

