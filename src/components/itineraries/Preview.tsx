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

                        {/* ================= GALLERY ================= */}
                        <Section title="Gallery">
                            {data?.images?.length ? (
                                <ImageCarousel images={data.images} />
                            ) : (
                                <Empty text="No images uploaded yet" />
                            )}
                        </Section>

                        {/* ================= TOUR ================= */}
                        <Section title="Tour Overview">
                            <Card className="p-5 grid grid-cols-2 gap-4">
                                <Info label="Title" value={data?.tour?.title} />
                                <Info label="Destination" value={data?.tour?.destination} />
                                <Info label="Origin" value={data?.tour?.origin_city} />
                                <Info
                                    label="Duration"
                                    value={`${data?.tour?.duration_days}D / ${data?.tour?.duration_nights}N`}
                                />
                                <Info
                                    label="Price"
                                    value={`${data?.tour?.currency} ${data?.tour?.base_price}`}
                                />
                                <Info label="Max Guests" value={data?.tour?.max_guests} />
                            </Card>

                            <p className="text-sm text-muted-foreground mt-4">
                                {data?.tour?.description || "-"}
                            </p>
                        </Section>

                        {/* ================= ITINERARY ================= */}
                        <Section title="Itinerary">
                            {data?.itinerary_days?.length ? (
                                <div className="space-y-4">
                                    {data.itinerary_days.map((day: any, i: number) => (
                                        <Card key={day.id} className="p-5 border-l-4 border-[#00AFEF]">

                                            {/* HEADER */}
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold">
                                                    Day {day.day_number || i + 1}
                                                </h3>

                                                <span className="text-sm font-medium text-[#00AFEF]">
                                                    {day.title || "No title"}
                                                </span>
                                            </div>

                                            {/* DESCRIPTION */}
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {day.description || "No description"}
                                            </p>

                                            {/* ACTIVITIES */}
                                            <div className="mt-4">
                                                <p className="text-xs font-medium text-gray-500 mb-2">
                                                    Activities
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {day.activities?.length ? (
                                                        day.activities.map((a: any) => (
                                                            <span
                                                                key={a.id}
                                                                className="text-xs px-2 py-1 rounded-full border bg-gray-50"
                                                            >
                                                                {a.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            No activities
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* IMAGES */}
                                            <div className="mt-4">
                                                {day.images?.length ? (
                                                    <div className="flex gap-2 overflow-x-auto">
                                                        {day.images.map((img: any, idx: number) => (
                                                            <img
                                                                key={idx}
                                                                src={img.image_url}
                                                                className="h-24 w-32 object-cover rounded-md border"
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        No images
                                                    </span>
                                                )}
                                            </div>

                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty text="No itinerary added yet" />
                            )}
                        </Section>

                        {/* ================= HOTELS ================= */}
                        <Section title="Hotels">
                            {data?.accommodations?.length ? (
                                <div className="grid gap-3">
                                    {data.accommodations.map((h: any) => (
                                        <Card key={h.id} className="p-4 flex justify-between">
                                            <div>
                                                <p className="font-medium">{h.hotel_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {h.location}
                                                </p>
                                            </div>

                                            <Badge variant="secondary">
                                                {h.nights} Nights • {h.meal_plan}
                                            </Badge>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty text="No hotels added yet" />
                            )}
                        </Section>

                        {/* ================= AVAILABILITY ================= */}
                        <Section title="Availability">
                            {data?.availability?.length ? (
                                <div className="grid gap-2">
                                    {data.availability.map((a: any) => (
                                        <Card
                                            key={a.id}
                                            className="p-3 flex justify-between"
                                        >
                                            <span className="text-sm">
                                                {a.start_date} → {a.end_date}
                                            </span>

                                            <Badge>
                                                {a.status}
                                            </Badge>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty text="No availability slots defined" />
                            )}
                        </Section>

                        {/* ================= POLICY ================= */}
                        <Section title="Cancellation Policy">
                            {data?.cancellation_policy?.length ? (
                                <div className="grid gap-2">
                                    {data.cancellation_policy.map((c: any) => (
                                        <Card
                                            key={c.id}
                                            className="p-3 flex justify-between"
                                        >
                                            <span className="text-sm">
                                                Cancel {c.days_before} days before
                                            </span>

                                            <Badge>
                                                {c.refund_percentage}% refund
                                            </Badge>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty text="No cancellation policy set" />
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
                <Badge>{data?.tour?.max_guests} Guests</Badge>
                <Badge>
                    {data?.tour?.currency} {data?.tour?.base_price}
                </Badge>
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
                {images.map((img: any, i: number) => {

                    let src = "";

                    if (typeof img === "string") {
                        src = img;
                    }
                    else if (img instanceof File || img instanceof Blob) {
                        src = URL.createObjectURL(img);
                    }
                    else if (img?.image_url) {
                        src = img.image_url;
                    }

                    return (
                        <div key={i} className="min-w-full h-[320px]">
                            <img
                                src={src}
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        </div>
                    );
                })}
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