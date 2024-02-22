import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {CheckCircle2} from "lucide-react";
import React from "react";

export function SuccessAlert() {
  return (
    <Alert variant="default" className="bg-green-100">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Thank you!</AlertTitle>
      <AlertDescription>
        <div className="text-base alert-success-test-color">
          Your feedback has successfully been submitted.
        </div>
      </AlertDescription>
    </Alert>
  )}

export default SuccessAlert;