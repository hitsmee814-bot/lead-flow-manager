"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, MapPin } from "lucide-react";

export default function ActivityRow({
    act,
    onChange,
    onDelete,
}: any) {
    const handleNumber = (val: string) => {
        if (val === "") return "";
        return Number(val);
    };

    return (
        <div className="border rounded-xl p-4 space-y-4 bg-white">

            {/* HEADER */}
            <div className="flex items-center gap-3">

                {/* NAME */}
                <div className="flex-1 space-y-1">
                    <label className="text-sm font-medium">
                        Activity Name
                    </label>

                    <Input
                        placeholder="e.g. Nameri National Park"
                        value={act.name || ""}
                        onChange={(e) =>
                            onChange("name", e.target.value)
                        }
                    />
                </div>

                {/* TYPE */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">
                        Type
                    </label>

                    <Select
                        value={act.type || "included"}
                        onValueChange={(val) =>
                            onChange("type", val)
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="included">Included</SelectItem>
                            <SelectItem value="mandatory">Mandatory</SelectItem>
                            <SelectItem value="optional">Optional</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* DELETE */}
                <Button
                    size="icon"
                    variant="destructive"
                    onClick={onDelete}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Description
                </label>

                <Textarea
                    placeholder="Activity description"
                    value={act.description || ""}
                    onChange={(e) =>
                        onChange("description", e.target.value)
                    }
                    rows={2}
                />
            </div>

            {/* LOCATION */}
            <div className="grid grid-cols-2 gap-4">

                {/* LATITUDE */}
                <div className="space-y-1 relative">
                    <label className="text-sm font-medium">
                        Latitude
                    </label>

                    <MapPin className="absolute left-2 top-9 h-4 w-4 text-gray-400" />

                    <Input
                        className="pl-8"
                        placeholder="26.9"
                        value={act.latitude ?? ""}
                        onChange={(e) =>
                            onChange("latitude", e.target.value)
                        }
                    />
                </div>

                {/* LONGITUDE */}
                <div className="space-y-1 relative">
                    <label className="text-sm font-medium">
                        Longitude
                    </label>

                    <MapPin className="absolute left-2 top-9 h-4 w-4 text-gray-400" />

                    <Input
                        className="pl-8"
                        placeholder="92.9"
                        value={act.longitude ?? ""}
                        onChange={(e) =>
                            onChange("longitude", e.target.value)
                        }
                    />
                </div>
            </div>
        </div>
    );
}