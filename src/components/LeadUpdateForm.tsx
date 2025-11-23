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
      age_of_traveller: formData.age_of_traveller ? Number(formData.age_of_traveller) : undefined,
      profession: formData.profession,
      traveller_type: formData.traveller_type,
      expected_budget: formData.expected_budget,
      person_interacting: formData.person_interacting,
    };

    onUpdate(updatedLead);
    toast.success("Lead updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Update Lead Information</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
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
            <Label htmlFor="expected_next_call">Expected Next Call</Label>
            <Input
              id="expected_next_call"
              type="date"
              value={formData.expected_next_call}
              onChange={(e) =>
                setFormData({ ...formData, expected_next_call: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="age_of_traveller">Age of Traveller</Label>
            <Input
              id="age_of_traveller"
              type="number"
              value={formData.age_of_traveller}
              onChange={(e) =>
                setFormData({ ...formData, age_of_traveller: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="traveller_type">Traveller Type</Label>
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
            <Label htmlFor="expected_budget">Expected Budget</Label>
            <Input
              id="expected_budget"
              value={formData.expected_budget}
              onChange={(e) =>
                setFormData({ ...formData, expected_budget: e.target.value })
              }
              placeholder="e.g., $5,000 - $8,000"
            />
          </div>

          <div>
            <Label htmlFor="person_interacting">Person Interacting</Label>
            <Input
              id="person_interacting"
              value={formData.person_interacting}
              onChange={(e) =>
                setFormData({ ...formData, person_interacting: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold mb-4">Log New Interaction</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interaction_date">Date</Label>
              <Input
                id="interaction_date"
                type="date"
                value={formData.interaction_date}
                onChange={(e) =>
                  setFormData({ ...formData, interaction_date: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="interaction_time">Time</Label>
              <Input
                id="interaction_time"
                type="time"
                value={formData.interaction_time}
                onChange={(e) =>
                  setFormData({ ...formData, interaction_time: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="interaction_duration">Duration</Label>
            <Input
              id="interaction_duration"
              value={formData.interaction_duration}
              onChange={(e) =>
                setFormData({ ...formData, interaction_duration: e.target.value })
              }
              placeholder="e.g., 15 min"
            />
          </div>

          <div>
            <Label htmlFor="interaction_details">Detailed Notes</Label>
            <Textarea
              id="interaction_details"
              value={formData.interaction_details}
              onChange={(e) =>
                setFormData({ ...formData, interaction_details: e.target.value })
              }
              rows={4}
              placeholder="Detailed notes about the interaction..."
            />
          </div>

          <div>
            <Label htmlFor="interaction_summary">Summary</Label>
            <Textarea
              id="interaction_summary"
              value={formData.interaction_summary}
              onChange={(e) =>
                setFormData({ ...formData, interaction_summary: e.target.value })
              }
              rows={2}
              placeholder="Brief summary of the interaction..."
            />
          </div>

          <div>
            <Label htmlFor="next_actions">Next Actions</Label>
            <Textarea
              id="next_actions"
              value={formData.next_actions}
              onChange={(e) =>
                setFormData({ ...formData, next_actions: e.target.value })
              }
              rows={2}
              placeholder="What needs to be done next..."
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </form>
  );
};
