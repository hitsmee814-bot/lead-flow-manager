import { Label } from "@/components/ui/label";

export const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="flex items-center gap-1 mb-2">
    {children}
    <span className="text-red-500">*</span>
  </Label>
);
