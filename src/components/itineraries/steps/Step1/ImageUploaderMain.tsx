"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { UploadCloud, X } from "lucide-react";
import { useRef, useEffect, useState } from "react";
export default function ImageUploaderMain({
    value,
    onChange,
}: {
    value: any[];
    onChange: (images: any[]) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [docTypes, setDocTypes] = useState<any[]>([]);
    /* ADD FILES */
    const handleFiles = (files: File[]) => {
        const newImages = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
            caption: "",
            is_cover: false,
            document_type: "", // 🔥 new field
        }));

        onChange([...(value || []), ...newImages]);
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

    useEffect(() => {
        const fetchDocTypes = async () => {
            try {
                const res = await fetch(
                    "http://150.241.244.100:8000/lookup/document-types-by-category/ITINERARY_IMAGE"
                );
                const data = await res.json();

                // adjust if API shape differs
                setDocTypes(data || []);
            } catch (err) {
                console.error("Failed to fetch document types", err);
            }
        };

        fetchDocTypes();
    }, []);

    /* REMOVE */
    const remove = (id: string) => {
        onChange(value.filter((img) => img.id !== id));
    };

    /* UPDATE */
    const update = (index: number, key: string, val: any) => {
        const updated = [...value];
        updated[index][key] = val;

        // only one cover allowed
        if (key === "is_cover" && val === true) {
            updated.forEach((img, i) => {
                if (i !== index) img.is_cover = false;
            });
        }

        onChange(updated);
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
                    className="bg-[#00AFEF] text-white"
                >
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload
                </Button>
            </div>

            <input
                ref={fileRef}
                type="file"
                hidden
                multiple
                accept="image/png,image/jpeg"
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
                                onClick={() => remove(img.id)}
                            >
                                <X className="h-3 w-3 text-red-500" />
                            </Button>

                            {/* PREVIEW */}
                            <img
                                src={img.preview}
                                className="h-24 w-full object-cover rounded"
                            />

                            {/* CAPTION */}
                            <Input
                                placeholder="Caption"
                                value={img.caption}
                                onChange={(e) =>
                                    update(i, "caption", e.target.value)
                                }
                                className="h-7 text-xs"
                            />

                            {/* ✅ DOCUMENT TYPE SELECT (FIXED) */}
                            <Select
                                value={img.document_type || ""}
                                onValueChange={(val) =>
                                    update(i, "document_type", val)
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
                                            {dt.document_type} {/* or dt.description */}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* COVER CHECKBOX */}
                            <label className="flex items-center gap-2 text-xs">
                                <input
                                    type="checkbox"
                                    checked={img.is_cover || false}
                                    onChange={(e) =>
                                        update(i, "is_cover", e.target.checked)
                                    }
                                />
                                Set as cover
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}