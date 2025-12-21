import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
}

export const SessionExpiredDialog = ({ open }: Props) => {
  return (
    <Dialog open={open}>
      <DialogContent className="flex flex-col items-center gap-4 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground text-center">
          Your session has expired.<br />
          Please login again.
        </p>
      </DialogContent>
    </Dialog>
  );
};
