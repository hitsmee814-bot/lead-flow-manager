"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "./custom/DateTimePicker";
import { toast } from "@/components/ui/use-toast";

interface LeadInsertModalProps {
  open: boolean;
  onClose: () => void;
}

export const LeadInsertModal = ({ open, onClose }: LeadInsertModalProps) => {
  const [formData, setFormData] = useState({
    platform: "facebook",
    destination_country: "",
    intended_travel_date: "",
    duration_of_travel: 1,
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    city: "",
  });

  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});

  const handleSave = () => {
    const requiredFields = [
      "platform",
      "destination_country",
      "intended_travel_date",
      "duration_of_travel",
      "first_name",
      "last_name",
      "phone_number",
      "email",
      "city",
    ];

    const newInvalid: Record<string, boolean> = {};
    let hasError = false;

    requiredFields.forEach((key) => {
      if (!formData[key as keyof typeof formData] || formData[key as keyof typeof formData] === "") {
        newInvalid[key] = true;
        hasError = true;
      } else {
        newInvalid[key] = false;
      }
    });

    setInvalidFields(newInvalid);

    if (hasError) {
      toast({
        title: "Validation Error",
        description: "Please fill all mandatory fields",
        className: "border-red-500 bg-red-50 text-red-900",
      });
      return;
    }

    const payload = {
      id: Date.now(),
      created_time: new Date().toISOString(),
      is_organic: true,
      platform: formData.platform,
      destination_country: formData.destination_country,
      intended_travel_date: formData.intended_travel_date,
      duration_of_travel: formData.duration_of_travel,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      email: formData.email,
      city: formData.city,
      load_timestamp: new Date().toISOString(),
    };
    console.log("Lead JSON:", payload);
    onClose();
  };

  const getInputClass = (field: string) => (invalidFields[field] ? "border-red-500" : "");

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent
        className="w-full max-w-2xl sm:mx-auto sm:my-8 flex flex-col"
        style={{ maxHeight: "90vh" }}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4 flex-shrink-0">
          <DialogTitle>Insert New Lead</DialogTitle>
        </DialogHeader>

        <div
          className="overflow-y-auto flex-1 py-6 grid gap-x-4 gap-y-4"
          style={{ gridTemplateColumns: "200px 1fr" }}
        >
          <Label className="text-right pr-4">Platform</Label>
          <div className="pl-3 pr-3">
            <Select
              value={formData.platform}
              onValueChange={(val) => setFormData({ ...formData, platform: val })}
            >
              <SelectTrigger className={"w-full " + getInputClass("platform")}>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Label className="text-right pr-4">Destination Country</Label>
          <div className="pl-3 pr-3">
            <Input
              value={formData.destination_country}
              onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
              placeholder="Country"
              className={getInputClass("destination_country")}
            />
          </div>

          <Label className="text-right pr-4">Intended Travel Date</Label>
          <div className="pl-3 pr-3">
            <DateTimePicker
              value={formData.intended_travel_date}
              onChange={(val) => setFormData({ ...formData, intended_travel_date: val })}
              className={getInputClass("intended_travel_date")}
            />
          </div>

          <Label className="text-right pr-4">Duration of Travel (days)</Label>
          <div className="pl-3 pr-3">
            <Slider
              value={[formData.duration_of_travel]}
              min={1}
              max={60}
              step={1}
              onValueChange={(val) => setFormData({ ...formData, duration_of_travel: val[0] })}
              className={getInputClass("duration_of_travel")}
            />
            <span className="text-sm text-muted-foreground mt-1 block">
              {formData.duration_of_travel} days
            </span>
          </div>

          <Label className="text-right pr-4">First Name</Label>
          <div className="pl-3 pr-3">
            <Input
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              placeholder="First Name"
              className={getInputClass("first_name")}
            />
          </div>

          <Label className="text-right pr-4">Last Name</Label>
          <div className="pl-3 pr-3">
            <Input
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              placeholder="Last Name"
              className={getInputClass("last_name")}
            />
          </div>

          <Label className="text-right pr-4">Phone Number</Label>
          <div className="pl-3 pr-3">
            <Input
              type="number"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder="Phone"
              className={getInputClass("phone_number")}
            />
          </div>

          <Label className="text-right pr-4">Email</Label>
          <div className="pl-3 pr-3">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              className={getInputClass("email")}
            />
          </div>

          <Label className="text-right pr-4">City</Label>
          <div className="pl-3 pr-3">
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="City"
              className={getInputClass("city")}
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} style={{background: '#00AFEF', color: 'white'}}>Save Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
