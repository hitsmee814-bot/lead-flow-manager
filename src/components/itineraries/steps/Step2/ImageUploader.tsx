"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ImageUploader({
  value,
  onUpload,
  itinerary_day_id,
}: {
  value: any[];
  onUpload: (images: any[]) => void;
  itinerary_day_id: string | number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [docTypes, setDocTypes] = useState<any[]>([]);

  /* ---------------- FETCH DOCUMENT TYPES ---------------- */
  useEffect(() => {
    const fetchDocTypes = async () => {
      try {
        const res = await fetch(
          "http://150.241.244.100:8000/lookup/document-types-by-category/ITINERARY_IMAGE"
        );
        const data = await res.json();

        setDocTypes(data || []);
      } catch (err) {
        console.error("Failed to fetch document types", err);
      }
    };

    fetchDocTypes();
  }, []);

  /* ---------------- HANDLE FILES ---------------- */
  const handleFiles = (files: File[]) => {
    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      caption: "",
      itinerary_day_id,
      preview: URL.createObjectURL(file),
      document_type: "", // ✅ new field
    }));

    onUpload([...(value || []), ...newImages]);
  };

  /* ---------------- REMOVE ---------------- */
  const removeImage = (id: string) => {
    onUpload(value.filter((img) => img.id !== id));
  };

  /* ---------------- UPDATE FIELD ---------------- */
  const updateImageField = (
    index: number,
    key: string,
    val: any
  ) => {
    const updated = [...value];
    updated[index][key] = val;
    onUpload(updated);
  };

  return (
    <div className="border rounded-xl p-4 bg-white space-y-3">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Images</p>
          <p className="text-xs text-muted-foreground">
            JPG / PNG only
          </p>
        </div>

        <Button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="bg-[#00AFEF] hover:bg-[#0095cc] text-white"
        >
          <UploadCloud className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* FILE INPUT */}
      <input
        ref={fileRef}
        type="file"
        hidden
        multiple
        accept="image/png,image/jpeg,image/jpg"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          handleFiles(files);

          // reset so same file can be reselected
          if (fileRef.current) fileRef.current.value = "";
        }}
      />

      {/* GRID */}
      {value?.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {value.map((img, i) => (
            <div
              key={img.id}
              className="border rounded-lg p-2 space-y-2 relative"
            >
              {/* DELETE */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => removeImage(img.id)}
              >
                <X className="h-3 w-3 text-red-500" />
              </Button>

              {/* PREVIEW */}
              <img
                src={img.preview}
                className="h-20 w-full object-cover rounded"
              />

              {/* FILE NAME */}
              <p className="text-[11px] truncate text-muted-foreground">
                {img.file?.name}
              </p>

              {/* CAPTION */}
              <Input
                placeholder="Caption"
                value={img.caption}
                onChange={(e) =>
                  updateImageField(i, "caption", e.target.value)
                }
                className="h-7 text-xs"
              />

              {/* DOCUMENT TYPE */}
              <Select
                value={img.document_type || ""}
                onValueChange={(val) =>
                  updateImageField(i, "document_type", val)
                }
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent>
                  {docTypes.map((dt: any) => (
                    <SelectItem
                      key={dt.document_type}
                      value={dt.document_type}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">
                          {dt.document_type}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {dt.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}