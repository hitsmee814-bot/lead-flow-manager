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
              onChange={(files) =>
                updateDay(day.id, "images", files)
              }
            />
          </div>

        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}