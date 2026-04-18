"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export default function ImageUploader({
  value,
  onChange,
}: {
  value: File[];
  onChange: (files: File[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="border rounded-xl p-4 bg-white">
      <input
        ref={ref}
        type="file"
        hidden
        multiple
        accept="image/png,image/jpeg,image/jpg"
        onChange={(e) =>
          onChange(Array.from(e.target.files || []))
        }
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Images</p>
          <p className="text-xs text-muted-foreground">
            JPG / JPEG / PNG only
          </p>
        </div>

        <Button
          type="button"
          onClick={() => ref.current?.click()}
          className="bg-[#00AFEF] hover:bg-[#0095cc]"
        >
          <UploadCloud className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      {value.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {value.map((f, i) => (
            <div
              key={i}
              className="text-xs px-2 py-1 bg-gray-100 rounded"
            >
              {f.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}