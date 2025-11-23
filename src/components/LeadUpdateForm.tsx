import { useState } from "react";
import { Lead } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface LeadUpdateFormProps {
  lead: Lead;
  onUpdate: (updatedLead: Lead) => void;
}

export const LeadUpdateForm = ({ lead, onUpdate }: LeadUpdateFormProps) => {
  const [formData, setFormData] = useState({
    category: lead.category || "",
    expected_next_call: lead.expected_next_call || "",
    age_of_traveller: lead.age_of_traveller || "",
    profession: lead.profession || "",
    traveller_type: lead.traveller_type || "",
    expected_budget: lead.expected_budget || "",
    person_interacting: lead.person_interacting || "",
    interaction_date: "",
    interaction_time: "",
    interaction_duration: "",
    interaction_details: "",
    interaction_summary: "",
    next_actions: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedLead: Lead = {
      ...lead,
      category: formData.category,
      expected_next_call: formData.expected_next_call,
      age_of_traveller: formData.age_of_traveller
        ? Number(formData.age_of_traveller)
        : undefined,
      profession: formData.profession,
      traveller_type: formData.traveller_type,
      expected_budget: formData.expected_budget,
      person_interacting: formData.person_interacting,
    };

    onUpdate(updatedLead);
    toast.success("Lead updated successfully!");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 pr-4 pb-6">
        <form id="leadForm" onSubmit={handleSubmit} className="space-y-6 overflow-y-auto">
          <div className="pl-2">
            <h3 className="text-lg font-semibold mb-4">Update Lead Information</h3>

            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hot Lead">Hot Lead</SelectItem>
                    <SelectItem value="Warm Lead">Warm Lead</SelectItem>
                    <SelectItem value="Cold Lead">Cold Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Expected Next Call</Label>
                <Input
                  type="date"
                  value={formData.expected_next_call}
                  onChange={(e) =>
                    setFormData({ ...formData, expected_next_call: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Age of Traveller</Label>
                <Input
                  type="number"
                  value={formData.age_of_traveller}
                  onChange={(e) =>
                    setFormData({ ...formData, age_of_traveller: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Profession</Label>
                <Input
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                />
              </div>

              <div>
                <Label>Traveller Type</Label>
                <Select
                  value={formData.traveller_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, traveller_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solo">Solo</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Friends">Friends</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Expected Budget</Label>
                <Input
                  value={formData.expected_budget}
                  onChange={(e) =>
                    setFormData({ ...formData, expected_budget: e.target.value })
                  }
                  placeholder="e.g., $5,000 - $8,000"
                />
              </div>

              <div>
                <Label>Person Interacting</Label>
                <Input
                  value={formData.person_interacting}
                  onChange={(e) =>
                    setFormData({ ...formData, person_interacting: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t pl-2">
            <h3 className="text-lg font-semibold mb-4">Log New Interaction</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.interaction_date}
                    onChange={(e) =>
                      setFormData({ ...formData, interaction_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={formData.interaction_time}
                    onChange={(e) =>
                      setFormData({ ...formData, interaction_time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Duration</Label>
                <Input
                  value={formData.interaction_duration}
                  onChange={(e) =>
                    setFormData({ ...formData, interaction_duration: e.target.value })
                  }
                  placeholder="e.g., 15 min"
                />
              </div>

              <div>
                <Label>Detailed Notes</Label>
                <Textarea
                  rows={4}
                  value={formData.interaction_details}
                  onChange={(e) =>
                    setFormData({ ...formData, interaction_details: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Summary</Label>
                <Textarea
                  rows={2}
                  value={formData.interaction_summary}
                  onChange={(e) =>
                    setFormData({ ...formData, interaction_summary: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Next Actions</Label>
                <Textarea
                  rows={2}
                  value={formData.next_actions}
                  onChange={(e) =>
                    setFormData({ ...formData, next_actions: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="sticky bottom-0 border-t bg-background py-3 px-4 shadow-[0_-4px_8px_rgba(0,0,0,0.05)]">
        <Button type="submit" form="leadForm" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
