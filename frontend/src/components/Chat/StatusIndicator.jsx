// StatusIndicator.jsx
import React from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

const StatusIndicator = ({ status }) => {
  if (!status) return null;

  return (
    <div className="z-50 animate-fade-in-up">
      <Alert className="flex items-center gap-2 border-0 bg-background/95 backdrop-blur-sm shadow-lg rounded-full px-4 py-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <AlertDescription className="text-foreground">
          {status}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StatusIndicator;
