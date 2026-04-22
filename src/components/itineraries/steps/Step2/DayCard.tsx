"use client";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ChevronDown,
    Copy,
    Trash2,
    Plus,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import ActivityRow from "./ActivityRow";
import ImageUploader from "./ImageUploader";
import { DateTimePicker } from "@/components/custom/DateTimePicker";

export default function DayCard({
    day,
    index,
    updateDay,
    copyDay,
    deleteDay,
    addActivity,
    updateActivity,
    deleteActivity,
}: any) {
    return (
        <Card className="p-4 rounded-xl border space-y-4">

            <Collapsible defaultOpen={day.open ?? true}>

                {/* HEADER */}
                <div className="flex justify-between items-center">

                    <CollapsibleTrigger className="flex-1 flex justify-between items-center pr-2">

                        <div className="space-y-0.5">
                            <p className="text-sm font-medium text-left">
                                Day {day.day_number || index + 1}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {day.title || "No title added"}
                            </p>
                        </div>

                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </CollapsibleTrigger>

                    <div className="flex gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyDay(day.id)}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => deleteDay(day.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* BODY */}
                <CollapsibleContent className="mt-4 space-y-4">

                    {/* TITLE FIELD */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Day Title
                        </label>

                        <Input
                            placeholder="e.g. Guwahati → Tezpur"
                            value={day.title}
                            onChange={(e) =>
                                updateDay(day.id, "title", e.target.value)
                            }
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Description
                        </label>

                        <Textarea
                            placeholder="Day description"
                            value={day.description}
                            onChange={(e) =>
                                updateDay(day.id, "description", e.target.value)
                            }
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        {/* DATE */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Date</label>

                            <DateTimePicker
                                value={day.date}
                                showTime={false} // 🔥 disables time
                                onChange={(val: string) =>
                                    updateDay(day.id, "date", val)
                                }
                                className="w-full"
                            />
                        </div>

                        {/* HOTEL */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Hotel Name</label>
                            <Input
                                placeholder="Hotel for the night"
                                value={day.hotel || ""}
                                onChange={(e) =>
                                    updateDay(day.id, "hotel", e.target.value)
                                }
                            />
                        </div>

                        {/* DISTANCE */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Distance (km)</label>
                            <Input
                                type="number"
                                placeholder="e.g. 120"
                                value={day.distance || ""}
                                onChange={(e) =>
                                    updateDay(day.id, "distance", Number(e.target.value))
                                }
                            />
                        </div>

                        {/* TRAVEL TIME */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Travel Time</label>
                            <Input
                                placeholder="e.g. 4h 30m"
                                value={day.travelTime || ""}
                                onChange={(e) =>
                                    updateDay(day.id, "travelTime", e.target.value)
                                }
                            />
                        </div>

                    </div>

                    {/* ACTIVITIES */}
                    <div className="space-y-2">

                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Activities</p>

                            <Button
                                size="sm"
                                className="bg-[#00AFEF] text-white"
                                onClick={() => addActivity(day.id)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {day.activities.map((act: any) => (
                                <ActivityRow
                                    key={act.id}
                                    act={act}
                                    onChange={(k: string, v: any) =>
                                        updateActivity(day.id, act.id, k, v)
                                    }
                                    onDelete={() =>
                                        deleteActivity(day.id, act.id)
                                    }
                                />
                            ))}
                        </div>

                    </div>

                    {/* IMAGES */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Images</p>

                        <ImageUploader
                            value={day.images}
                            itinerary_day_id={day.day_number}
                            onUpload={(imgs) =>
                                updateDay(day.id, "images", imgs)
                            }
                        />
                    </div>

                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}