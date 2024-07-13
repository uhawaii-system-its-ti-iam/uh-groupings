import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';

const ErrorAlert = () => {
    return (
        <Alert className="mb-5" variant="destructive">
            <XCircle />
            <AlertTitle>Oops!</AlertTitle>
            <AlertDescription>Your feedback failed to submit. Please try again.</AlertDescription>
        </Alert>
    );
};

export default ErrorAlert;
