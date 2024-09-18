import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getAnnouncements } from '@/lib/fetchers';

const Announcements = async () => {
    const announcements = await getAnnouncements();
    const activeAnnouncements = () => {
        if (!announcements || !announcements.announcements) {
            return [];
        }
        return announcements.announcements
            .filter((announcement) => announcement.state === 'Active')
            .map((announcement) => announcement.message);
    };

    return (
        <div className="mt-5 mb-5">
            {activeAnnouncements().map((announcement: string, index: number) => (
                <Alert key={index} className="bg-yellow-100 border border-yellow-200 mb-2">
                    <AlertCircle aria-label="icon" className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Announcement</AlertTitle>
                    <AlertDescription>{announcement}</AlertDescription>
                </Alert>
            ))}
        </div>
    );
};

export default Announcements;
