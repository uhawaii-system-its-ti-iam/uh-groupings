import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

const SuccessAlert = () => {
    return (
        <Alert className="mb-5" variant="success">
            <CheckCircle2 />
            <AlertTitle>Thank You!</AlertTitle>
            <AlertDescription>Your feedback has been successfully submitted.</AlertDescription>
        </Alert>
    );
};

export default SuccessAlert;
