import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2Icon } from 'lucide-react';

const RemoveMemberTrashcan = ({ action, children }: { action: () => void; children: React.ReactNode }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button onClick={action}>
                    <Trash2Icon className="h-4 w-4 text-red-600" />
                </button>
            </AlertDialogTrigger>
            {children}
        </AlertDialog>
    );
};

export default RemoveMemberTrashcan;
