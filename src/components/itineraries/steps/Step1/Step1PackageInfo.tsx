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
import { Editor } from "@tinymce/tinymce-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

import { Bold, Italic, List, Heading2, Link2 } from "lucide-react";

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

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Describe what makes this tour special...",
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: data.description || "",
        editorProps: {
            attributes: {
                class:
                    "prose max-w-none min-h-[200px] focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            update("description", editor.getHTML());
        },
    });
    if (!editor) return null;


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

                <div className="border rounded-lg overflow-hidden">

                    {/* Toolbar */}
                    <div className="flex gap-2 border-b p-2 bg-muted">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`px-2 py-1 rounded ${editor.isActive("bold") ? "bg-gray-300" : ""
                                }`}
                        >
                            <Bold size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`px-2 py-1 rounded ${editor.isActive("italic") ? "bg-gray-300" : ""
                                }`}
                        >
                            <Italic size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`px-2 py-1 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
                                }`}
                        >
                            <Heading2 size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`px-2 py-1 rounded ${editor.isActive("bulletList") ? "bg-gray-300" : ""
                                }`}
                        >
                            <List size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                const url = prompt("Enter URL");
                                if (url) editor.chain().focus().setLink({ href: url }).run();
                            }}
                        >
                            <Link2 size={16} />
                        </button>
                    </div>

                    {/* Editor */}
                    <EditorContent
                        editor={editor}
                        className="p-4 min-h-[200px] prose max-w-none focus:outline-none"
                    />
                </div>
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