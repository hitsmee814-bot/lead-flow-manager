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
  lead: Lead;
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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Lead Information</h3>
        
        <div className="space-y-1">
          <DetailRow icon={User} label="Name" value={`${lead.first_name} ${lead.last_name}`} />
          <DetailRow icon={Mail} label="Email" value={lead.email} />
          <DetailRow icon={Phone} label="Phone" value={lead.phone_number} />
          <DetailRow icon={MapPin} label="City" value={lead.city} />
          <DetailRow icon={Globe} label="Country" value={lead.country} />
          <DetailRow icon={Clock} label="Contact Date" value={lead.when} />
          <DetailRow icon={Timer} label="Duration" value={lead.duration} />
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold mb-4">Status & Assignment</h3>
        
        <div className="space-y-3">
          <DetailRow
            icon={Tag}
            label="Category"
            value={
              lead.category ? (
                <Badge
                  variant={
                    lead.category.includes("Hot")
                      ? "success"
                      : lead.category.includes("Warm")
                      ? "warning"
                      : "info"
                  }
                >
                  {lead.category}
                </Badge>
              ) : (
                "Not set"
              )
            }
          />
          <DetailRow
            icon={Activity}
            label="Status"
            value={
              lead.status ? (
                <Badge variant="default">{lead.status}</Badge>
              ) : (
                "Not set"
              )
            }
          />
          <DetailRow
            icon={Users}
            label="Assigned Group"
            value={
              lead.assigned_group ? (
                <Badge variant="secondary">{lead.assigned_group}</Badge>
              ) : (
                "Not assigned"
              )
            }
          />
          <DetailRow icon={Tag} label="Platform" value={lead.platform} />
        </div>
      </div>
    </div>
  );
};
