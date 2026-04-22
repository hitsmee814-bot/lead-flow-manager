"use client";

import { RequiredLabel } from "@/components/RequiredLable";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import ImageUploaderMain from "./ImageUploaderMain";
import { DateTimePicker } from "@/components/custom/DateTimePicker";

type Props = {
    data: any;
    setData: (data: any) => void;
};

export default function Step1PackageInfo({ data, setData }: Props) {
    const update = (key: string, value: any) => {
        let updated = { ...data, [key]: value };

        if (key === "start_date" && data.end_date && value > data.end_date) {
            updated.end_date = value;
        }

        if (key === "end_date" && data.start_date && value < data.start_date) {
            return; // block invalid selection
        }

        if (key === "status" && value === "active" && !data.published_at) {
            updated.published_at = new Date().toISOString();
        }

        // Auto-set published_at when activating
        if (key === "status" && value === "active" && !data.published_at) {
            updated.published_at = new Date().toISOString();
        }

        setData(updated);
    };

    return (
        <div className="space-y-6 pr-4">
            {/* HEADER */}
            <div>
                <h3 className="text-lg font-semibold">Tour Package Details</h3>
                <p className="text-sm text-muted-foreground">
                    Basic information about your tour
                </p>
            </div>

            {/* TITLE */}
            <div>
                <RequiredLabel>Tour Title</RequiredLabel>
                <Input
                    value={data.title || ""}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="e.g. Magical Rajasthan Heritage Tour"
                />
            </div>

            {/* DESCRIPTION */}
            <div>
                <RequiredLabel>Description</RequiredLabel>
                <Input
                    value={data.description || ""}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe what makes this tour special..."
                />
            </div>

            {/* ORIGIN + DESTINATION */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <RequiredLabel>Origin City</RequiredLabel>
                    <Input
                        value={data.origin_city || ""}
                        onChange={(e) =>
                            update("origin_city", e.target.value)
                        }
                        placeholder="e.g. Guwahati"
                    />
                </div>

                <div>
                    <RequiredLabel>Destination</RequiredLabel>
                    <Input
                        value={data.destination || ""}
                        onChange={(e) =>
                            update("destination", e.target.value)
                        }
                        placeholder="e.g. Arunachal Pradesh"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <RequiredLabel>Start Date</RequiredLabel>
                    <DateTimePicker
                        value={data.start_date}
                        onChange={(val) => update("start_date", val)}
                        showTime={false}
                    />
                </div>

                <div>
                    <RequiredLabel>End Date</RequiredLabel>
                    <DateTimePicker
                        value={data.end_date}
                        onChange={(val) => update("end_date", val)}
                        showTime={false}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <RequiredLabel>Base Price</RequiredLabel>
                    <Input
                        type="number"
                        value={data.base_price ?? ""}
                        onChange={(e) =>
                            update(
                                "base_price",
                                e.target.value === "" ? "" : Number(e.target.value)
                            )
                        }
                    />
                </div>

                <div>
                    <RequiredLabel>Currency</RequiredLabel>
                    <Select
                        value={data.currency || "INR"}
                        onValueChange={(val) => update("currency", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <RequiredLabel>Max Guests</RequiredLabel>
                    <Input
                        type="number"
                        value={data.max_guests ?? ""}
                        onChange={(e) =>
                            update(
                                "max_guests",
                                e.target.value === "" ? "" : Number(e.target.value)
                            )
                        }
                    />
                </div>

                <div>
                    <RequiredLabel>Status</RequiredLabel>
                    <Select
                        value={data.status || "draft"}
                        onValueChange={(val) => update("status", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <div>
                <RequiredLabel>Tour Images</RequiredLabel>

                <ImageUploaderMain
                    value={data.images || []}
                    onChange={(imgs) => update("images", imgs)}
                />
            </div>
        </div>
    );
}