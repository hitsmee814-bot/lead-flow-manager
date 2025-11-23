import { Lead } from "@/types/lead";
import { Badge } from "@/components/Badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Timer,
  Tag,
  Users,
  Activity,
} from "lucide-react";

interface LeadDetailPanelProps {
  lead: any;
}
export const LeadDetailPanel = ({ lead }: LeadDetailPanelProps) => {
  const DetailRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );

  return (
  <div className="min-h-full pr-2 space-y-6 pb-6">

      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
        <div className="space-y-1">
          <DetailRow icon={User} label="Name" value={`${lead.first_name} ${lead.last_name}`} />
          <DetailRow icon={Mail} label="Email" value={lead.email} />
          <DetailRow icon={Phone} label="Phone" value={lead.phone_number} />
          <DetailRow icon={MapPin} label="City" value={lead.city ?? "Not specified"} />
        </div>
      </div>

      {(lead.destination_country ||
        lead.intended_travel_date ||
        lead.duration_of_travel) && (
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Travel Interest</h3>
          <div className="space-y-1">
            <DetailRow
              icon={Globe}
              label="Destination Country"
              value={lead.destination_country ?? "Not specified"}
            />
            <DetailRow
              icon={Clock}
              label="Intended Travel Date"
              value={lead.intended_travel_date ?? "Not specified"}
            />
            <DetailRow
              icon={Timer}
              label="Duration of Travel"
              value={lead.duration_of_travel ?? "Not specified"}
            />
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold mb-4">Lead Details</h3>
        <div className="space-y-1">
          <DetailRow
            icon={Tag}
            label="Platform"
            value={lead.platform?.toUpperCase() ?? "Unknown"}
          />
          <DetailRow
            icon={Clock}
            label="Created On"
            value={lead.load_timestamp?.replace("GMT", "") ?? "Not available"}
          />
        </div>
      </div>
    </div>
  );
};
