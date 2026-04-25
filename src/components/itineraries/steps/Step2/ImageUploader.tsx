"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

    const handleFiles = (files: File[]) => {
        const newImages = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
            caption: "",
            itinerary_day_id,
            preview: URL.createObjectURL(file),
            document_type: "", // ✅ ADD THIS
        }));

        onUpload([...(value || []), ...newImages]);
    };

    const [docTypes, setDocTypes] = useState<any[]>([]);

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

    const removeImage = (id: string) => {
        const img = value.find((i) => i.id === id);

        if (img?.preview?.startsWith("blob:")) {
            URL.revokeObjectURL(img.preview);
        }

        onUpload(value.filter((img) => img.id !== id));
    };

    useEffect(() => {
        return () => {
            value?.forEach((img) => {
                if (img.preview?.startsWith("blob:")) {
                    URL.revokeObjectURL(img.preview);
                }
            });
        };
    }, []);
    /* ---------------- UPDATE CAPTION ---------------- */
    const updateCaption = (index: number, caption: string) => {
        const updated = [...value];
        updated[index].caption = caption;
        onUpload(updated);
    };

    const updateField = (index: number, key: string, val: any) => {
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
                    className="bg-[#00AFEF] hover:bg-[#0095cc]"
                >
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload
                </Button>
            </div>

            {/* INPUT */}
            <input
                ref={fileRef}
                type="file"
                hidden
                multiple
                accept="image/png,image/jpeg,image/jpg"
                onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    handleFiles(files);

                    if (fileRef.current) {
                        fileRef.current.value = "";
                    }
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

                            <img
                                src={img.preview || img.image_url}
                                className="h-20 w-full object-cover rounded"
                            />

                            <p className="text-[11px] truncate text-muted-foreground">
                                {img.file?.name || img.image_url?.split("/").pop() || "Image"}
                            </p>

                            {/* CAPTION */}
                            <Input
                                placeholder="Caption"
                                value={img.caption}
                                onChange={(e) =>
                                    updateCaption(i, e.target.value)
                                }
                                className="h-7 text-xs"
                            />
                            <Select
                                value={img.document_type || ""}
                                onValueChange={(val) => updateField(i, "document_type", val)}
                            >
                                <SelectTrigger className="h-7 text-xs">
                                    <SelectValue placeholder="Select type">
                                        {img.document_type}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {docTypes.map((dt: any) => (
                                        <SelectItem key={dt.document_type} value={dt.document_type}>
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