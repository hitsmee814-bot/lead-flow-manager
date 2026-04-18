"use client";

import { DateTimePicker } from "@/components/custom/DateTimePicker";
import { RequiredLabel } from "@/components/RequiredLable";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Props = {
    data: any;
    setData: (data: any) => void;
};

export default function Step1PackageInfo({ data, setData }: Props) {
    const update = (key: string, value: any) => {
        let updated = { ...data, [key]: value };

        if (key === "status" && value === "active" && !data.published_at) {
            updated.published_at = new Date().toISOString();
        }

        setData(updated);
    };

    return (
        <div className="space-y-6 pr-4">

            <div>
                <h3 className="text-lg font-semibold">Tour Package Details</h3>
                <p className="text-sm text-muted-foreground">
                    Basic information about your tour
                </p>
            </div>

            <div>
                <RequiredLabel>Tour Title</RequiredLabel>
                <Input
                    value={data.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="e.g. Magical Rajasthan Heritage Tour"
                />
            </div>

            <div>
                <RequiredLabel>Description</RequiredLabel>
                <Input
                    value={data.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe what makes this tour special..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <RequiredLabel>Duration (Days)</RequiredLabel>
                    <Input
                        type="number"
                        value={data.duration_days}
                        onChange={(e) =>
                            update("duration_days", Number(e.target.value))
                        }
                    />
                </div>

                <div>
                    <RequiredLabel>Duration (Nights)</RequiredLabel>
                    <Input
                        type="number"
                        value={data.duration_nights}
                        onChange={(e) =>
                            update("duration_nights", Number(e.target.value))
                        }
                    />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium">Active</p>
                    <p className="text-xs text-muted-foreground">
                        Toggle visibility of this tour
                    </p>
                </div>

                <Switch
                    checked={data.is_active}
                    onCheckedChange={(val) => update("is_active", val)}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-muted-foreground">
                        Average Rating
                    </label>
                    <Input value={data.avg_rating} disabled />
                </div>

                <div>
                    <label className="text-sm text-muted-foreground">
                        Total Reviews
                    </label>
                    <Input value={data.total_reviews} disabled />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <RequiredLabel>Origin City</RequiredLabel>
                    <Input
                        value={data.origin_city}
                        onChange={(e) => update("origin_city", e.target.value)}
                    />
                </div>

                <div>
                    <RequiredLabel>Destination</RequiredLabel>
                    <Input
                        value={data.destination}
                        onChange={(e) => update("destination", e.target.value)}
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
                        value={data.base_price}
                        onChange={(e) =>
                            update("base_price", Number(e.target.value))
                        }
                    />
                </div>

                <div>
                    <RequiredLabel>Currency</RequiredLabel>
                    <Select
                        value={data.currency}
                        onValueChange={(val) => update("currency", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* META */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <RequiredLabel>Max Guests</RequiredLabel>
                    <Input
                        type="number"
                        value={data.max_guests}
                        onChange={(e) =>
                            update("max_guests", Number(e.target.value))
                        }
                    />
                </div>

                <div>
                    <RequiredLabel>Status</RequiredLabel>
                    <Select
                        value={data.status}
                        onValueChange={(val) => update("status", val)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}