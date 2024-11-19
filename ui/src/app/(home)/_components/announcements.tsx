import { Alert, AlertDescription } from '@/components/ui/alert';
import { getAnnouncements } from '@/lib/fetchers';

const Announcements = async () => {
    const announcements = await getAnnouncements();
    const activeAnnouncements = () =>
        announcements.announcements
            .filter((announcement) => announcement.state === 'Active')
            .map((announcement) => announcement.message);

    return (
        <>
            {activeAnnouncements().map((announcement: string, index: number) => (
                <Alert key={index} className="border mb-4 first:-mt-5" variant="warning" hasCloseButton>
                    <AlertDescription>{announcement}</AlertDescription>
                </Alert>
            ))}
        </>
    );
};

export default Announcements;
