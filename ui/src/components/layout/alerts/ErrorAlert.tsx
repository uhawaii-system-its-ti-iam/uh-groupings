import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {XCircle} from "lucide-react";
import React from "react";

export function ErrorAlert() {
  return (
    <Alert variant="destructive" className="bg-red-100">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="text-base text-red-500">
        Email feedback was unsuccessful. Please try again.
      </AlertDescription>
    </Alert>
  )}

export default ErrorAlert;