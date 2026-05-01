"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

/* ================= MAIN ================= */

export default function TourPreview({
    open,
    onClose,
    data,
}: {
    open: boolean;
    onClose: () => void;
    data: any;
}) {

    const [resolvedImages, setResolvedImages] = useState<any[]>([]);
    const [resolvedDays, setResolvedDays] = useState<any[]>([]);

    const resolveImage = async (img: any) => {
        // already local upload
        if (img.preview?.startsWith("blob:")) return img;

        // already resolved
        if (img.preview) return img;

        // no key
        if (!img.image_url) return img;

        try {
            const res = await fetch(
                `https://ascendus.bonhomiee.com/files/download?filename=${encodeURIComponent(img.image_url)}`
            );

            const blob = await res.blob();
            const preview = URL.createObjectURL(blob);

            return { ...img, preview };
        } catch (err) {
            console.error("Image download failed", err);
            return img;
        }
    };

    useEffect(() => {
        const load = async () => {
            // TOUR LEVEL IMAGES
            const imgs = await Promise.all(
                (data?.images || []).map(resolveImage)
            );
            setResolvedImages(imgs);

            // ITINERARY IMAGES
            const days = await Promise.all(
                (data?.itinerary_days || []).map(async (day: any) => {
                    const imgs = await Promise.all(
                        (day.images || []).map(resolveImage)
                    );

                    return { ...day, images: imgs };
                })
            );

            setResolvedDays(days);
        };

        if (open) load(); // only run when modal opens
    }, [data, open]);

    useEffect(() => {
        return () => {
            resolvedImages.forEach((img) => {
                if (img.preview?.startsWith("blob:")) {
                    URL.revokeObjectURL(img.preview);
                }
            });

            resolvedDays.forEach((day) => {
                day.images?.forEach((img: any) => {
                    if (img.preview?.startsWith("blob:")) {
                        URL.revokeObjectURL(img.preview);
                    }
                });
            });
        };
    }, [resolvedImages, resolvedDays]);
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl h-[92vh] p-0 overflow-hidden">
                <DialogHeader className="border-b bg-gradient-to-r from-[#00AFEF]/10 to-transparent px-6 py-4">
                    <DialogTitle className="text-xl font-semibold">
                        Tour Preview
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-full">
                    <div className="p-6 space-y-10">

                        <HeroSection data={data} />

                        {/* ================= TOUR OVERVIEW ================= */}
                        <Section title="Tour Overview">
                            <Card className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                                <Info label="Title" value={data?.tour?.title} />
                                <Info label="Origin" value={data?.tour?.origin_city} />
                                <Info label="Destination" value={data?.tour?.destination} />
                                <Info label="Duration" value={`${data?.tour?.duration_days} Days / ${data?.tour?.duration_nights} Nights`} />
                                <Info label="Base Price" value={`${data?.tour?.currency} ${data?.tour?.base_price}`} />
                                <Info label="Max Guests" value={data?.tour?.max_guests} />
                                <Info label="Status" value={data?.tour?.status} />
                                <Info label="Rating" value={data?.tour?.avg_rating || 0} />
                                <Info label="Reviews" value={data?.tour?.total_reviews || 0} />
                            </Card>

                            <p className="text-sm text-muted-foreground mt-4">
                                {data?.tour?.description || "-"}
                            </p>
                        </Section>

                        {/* ================= GALLERY ================= */}
                        <Section title="Gallery">
                            {data?.images?.length ? (
                                <ImageCarousel images={resolvedImages} />) : (
                                <Empty text="No images uploaded yet" />
                            )}
                        </Section>

                        {/* ================= AVAILABILITY (ENHANCED) ================= */}
                        <Section title="Availability & Pricing">
                            {data?.availability?.length ? (
                                <div className="space-y-3">
                                    {data.availability.map((a: any) => (
                                        <Card key={a.id} className="p-4 flex justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">
                                                    {a.start_date} → {a.end_date}
                                                </p>

                                                <div className="flex gap-3 text-xs text-muted-foreground">
                                                    <span>💰 ₹{a.price}</span>
                                                    <span>🎟 Slots: {a.available_slots}/{a.total_slots}</span>
                                                </div>
                                            </div>

                                            <Badge
                                                className={
                                                    a.status === "available"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }
                                            >
                                                {a.status}
                                            </Badge>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty text="No availability set" />
                            )}
                        </Section>

                        {/* ================= ITINERARY ================= */}
                        <Section title="Day-wise Itinerary">
                            {data?.itinerary_days?.length ? (
                                <div className="space-y-5">
                                    {resolvedDays.map((day: any, i: number) => (
                                        <Card key={day.id} className="p-5 border-l-4 border-[#00AFEF]">

                                            <div className="flex justify-between">
                                                <h3 className="font-semibold">
                                                    Day {day.day_number || i + 1}
                                                </h3>
                                                <span className="text-[#00AFEF] font-medium text-sm">
                                                    {day.title}
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted-foreground mt-2">
                                                {day.description}
                                            </p>

                                            {/* Activities */}
                                            <div className="mt-4">
                                                <p className="text-xs font-semibold text-gray-500 mb-2">
                                                    Activities
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {day.activities?.length ? (
                                                        day.activities.map((a: any) => (
                                                            <Badge
                                                                key={a.id}
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {a.name} ({a.type})
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            No activities
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Images */}
                                            {day.images?.length > 0 && (
                                                <div className="mt-4 flex gap-2 overflow-x-auto">
                                                    {day.images.map((img: any, idx: number) => (
                                                        <img
                                                            key={idx}
                                                            src={img?.preview}
                                                            className="h-24 w-32 object-cover rounded-md border"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty text="No itinerary added yet" />
                            )}
                        </Section>

                        {/* ================= ACCOMMODATION ================= */}
                        <Section title="Accommodation Plan">
                            {data?.accommodations?.length ? (
                                <div className="space-y-3">
                                    {data.accommodations.map((h: any) => (
                                        <Card key={h.id} className="p-4 flex justify-between">
                                            <div>
                                                <p className="font-medium">{h.hotel_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {h.location}
                                                </p>
                                            </div>

                                            <Badge>
                                                {h.nights} Nights • {h.meal_plan}
                                            </Badge>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty text="No accommodations added" />
                            )}
                        </Section>

                        {/* ================= CANCELLATION POLICY ================= */}
                        <Section title="Cancellation Policy">
                            {data?.cancellation_policy?.length ? (
                                <div className="grid gap-2">
                                    {data.cancellation_policy.map((c: any) => (
                                        <Card key={c.id} className="p-3 flex justify-between">
                                            <span className="text-sm">
                                                Cancel {c.days_before} days before departure
                                            </span>

                                            <Badge>
                                                {c.refund_percentage}% refund
                                            </Badge>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty text="No cancellation policy defined" />
                            )}
                        </Section>

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

/* ================= HERO ================= */

function HeroSection({ data }: any) {
    return (
        <Card className="p-6 bg-gradient-to-r from-[#00AFEF]/10 to-transparent border-none">
            <h2 className="text-2xl font-semibold">
                {data?.tour?.title}
            </h2>

            <p className="text-sm text-muted-foreground">
                {data?.tour?.origin_city} → {data?.tour?.destination}
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">
                <Badge>{data?.tour?.duration_days} Days</Badge>
                <Badge>{data?.tour?.duration_nights} Nights</Badge>
                <Badge>₹ {data?.tour?.base_price}</Badge>
                <Badge>{data?.tour?.status}</Badge>
            </div>
        </Card>
    );
}

/* ================= IMAGE CAROUSEL ================= */

function ImageCarousel({ images }: { images: any[] }) {
    const [emblaRef] = useEmblaCarousel({ loop: true });

    return (
        <div className="overflow-hidden rounded-xl border" ref={emblaRef}>
            <div className="flex">
                {images.map((img: any, i: number) => (
                    <div key={i} className="min-w-full h-[320px]">
                        <img
                            src={img.preview}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ================= HELPERS ================= */

function Section({ title, children }: any) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                {title}
            </h3>
            {children}
        </div>
    );
}

function Info({ label, value }: any) {
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value || "-"}</p>
        </div>
    );
}

function Empty({ text }: { text: string }) {
    return (
        <div className="text-sm text-muted-foreground border rounded-lg p-4 text-center bg-muted/20">
            {text}
        </div>
    );
}