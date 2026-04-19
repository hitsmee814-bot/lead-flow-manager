"use client";

import { useState } from "react";
import Step1PackageInfo from "./steps/Step1/Step1PackageInfo";
import Step2ItineraryDays from "./steps/Step2/Step2ItineraryDays";
import Step3Accommodation from "./steps/Step3/Step3Accommodation";
import Step4Availability from "./steps/Step4/Step4Availability";
import Step5CancellationPolicy from "./steps/Step5/Step5CancellationPolicy";
import TourPreview from "./Preview";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

type Props = {
    onCancel: () => void;
    itineraryData?: any;
};

export default function ItineraryBuilder({
    onCancel,
    itineraryData,
}: Props) {
    const { toast } = useToast();
    const [step, setStep] = useState(1); // cleaner UX
    const [showPreview, setShowPreview] = useState(false);
    const steps = [
        { id: 1, label: "Package" },
        { id: 2, label: "Itinerary" },
        { id: 3, label: "Hotels" },
        { id: 4, label: "Availability" },
        { id: 5, label: "Policy" },
    ];

    const [formData, setFormData] = useState<any>(() => {
        const t = itineraryData;

        if (!t) {
            return {
                tour: {
                    id: null,
                    title: "",
                    description: "",
                    duration_days: 1,
                    duration_nights: 0,
                    start_date: "",
                    end_date: "",
                    origin_city: "",
                    destination: "",
                    base_price: 0,
                    currency: "INR",
                    max_guests: 0,
                    avg_rating: 0,
                    total_reviews: 0,
                    status: "draft",
                    is_active: true,
                    created_at: "",
                    published_at: "",
                },
                availability: [],
                images: [],
                cancellation_policy: [],
                accommodations: [],
                itinerary_days: [],
            };
        }

        const tour = t.tour ?? t;

        return {
            tour: {
                id: tour.id ?? null,
                title: tour.title ?? "",
                description: tour.description ?? "",
                duration_days: tour.duration_days ?? 1,
                duration_nights: tour.duration_nights ?? 0,
                start_date: tour.start_date ?? "",
                end_date: tour.end_date ?? "",
                origin_city: tour.origin_city ?? "",
                destination: tour.destination ?? "",
                base_price: tour.base_price ?? 0,
                currency: tour.currency ?? "INR",
                max_guests: tour.max_guests ?? 0,
                avg_rating: tour.avg_rating ?? 0,
                total_reviews: tour.total_reviews ?? 0,
                status: tour.status ?? "draft",
                is_active: tour.is_active ?? true,
                created_at: tour.created_at ?? "",
                published_at: tour.published_at ?? "",
            },
            availability: (t.availability || []).map((a: any) => ({
                id: String(a.id),

                start_date: a.start_date,
                end_date: a.end_date,

                price: a.price,
                total_slots: a.total_slots,
                available_slots: a.available_slots,

                status: a.status,
            })),
            images: t.images ?? [],

            cancellation_policy: (t.cancellation_policy ?? []).map((c: any) => ({
                id: String(c.id),
                days_before: c.days_before,
                refund_percentage: c.refund_percentage,
            })),

            accommodations: t.accommodations.map((h: any) => ({
                id: String(h.id),
                hotel_name: h.hotel_name,
                location: h.location,
                nights: h.nights,
                meal_plan: h.meal_plan,
            })),

            itinerary_days: (t.itinerary_days ?? []).map((d: any) => ({
                id: crypto.randomUUID(),
                day_number: d.day_number,
                title: d.title,
                description: d.description,
                hotel: "",
                from: "",
                to: "",
                distance: "",
                travelTime: "",
                activities: (d.activities ?? []).map((a: any) => ({
                    id: String(a.id),
                    name: a.name,
                    type: a.type,
                    description: a.description,
                    latitude: String(a.latitude),
                    longitude: String(a.longitude),
                })),
                images: d.images ?? [],
            })),
        };
    });

    const totalSteps = steps.length;

    const createItinerary = async () => {
        try {
            const payload = {
                tour: formData.tour,
                availability: formData.availability.map((a: any) => ({
                    start_date: a.start_date || "",
                    end_date: a.end_date || "",
                    price: Number(a.price || 0),
                    total_slots: Number(a.total_slots || 0),
                    available_slots: Number(a.available_slots || 0),
                    status: a.status || "available",
                })),

                images: formData.images || [],

                cancellation_policy: formData.cancellation_policy
                    .filter((c: any) => c.days_before != null)
                    .map((c: any) => ({
                        days_before: Number(c.days_before),
                        refund_percentage: Number(c.refund_percentage),
                    })),

                accommodations: (formData.accommodations || []).map((h: any) => ({
                    hotel_name: h.hotel_name,
                    location: h.location,
                    nights: h.nights,
                    meal_plan: h.meal_plan,
                })),

                itinerary_days: formData.itinerary_days.map((d: any) => ({
                    date: d.date || new Date().toISOString().split("T")[0],
                    day_number: Number(d.day_number),
                    title: d.title || "",
                    description: d.description || "",
                    hotel_name: d.hotel || "",
                    distance_km: Number(d.distance || 0),
                    travel_time: d.travelTime || "",
                    activities: (d.activities || []).map((a: any) => ({
                        name: a.name,
                        type: a.type,
                        description: a.description,
                        latitude: Number(a.latitude),
                        longitude: Number(a.longitude),
                    })),
                    images: d.images || [],
                })),
            };

            console.log(payload);

            const res = await fetch(
                "http://150.241.244.100:8000/itinerary/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                console.error("CREATE ITINERARY FAILED:", data);

                toast({
                    title: "Failed to create itinerary",
                    description:
                        data?.message || "Something went wrong. Please try again.",
                    className: "border-red-500 bg-red-50 text-red-900",
                });

                return;
            }

            console.log("ITINERARY CREATED SUCCESSFULLY:", data);
            toast({
                title: "Itinerary created 🎉",
                description: "Refreshing list...",
                className: "border-green-500 bg-green-50 text-green-900",
            });

            setFormData(getInitialState());
            setStep(1);

            setTimeout(() => {
                onCancel();
            }, 500);
        } catch (err) {
            console.error("API ERROR:", err);

            toast({
                title: "Network error",
                description: "Unable to reach server. Please try again.",
                className: "border-red-500 bg-red-50 text-red-900",
            });
        }
    };

    const next = async () => {
        if (step < totalSteps) {
            setStep(step + 1);
            return;
        }

        console.log("Submitting payload:", formData);

        await createItinerary();
    };

    const back = () => {
        if (step > 1) setStep(step - 1);
    };

    const getInitialState = () => ({
        tour: {
            id: null,
            title: "",
            description: "",
            duration_days: 1,
            duration_nights: 0,
            start_date: "",
            end_date: "",
            origin_city: "",
            destination: "",
            base_price: 0,
            currency: "INR",
            max_guests: 0,
            avg_rating: 0,
            total_reviews: 0,
            status: "draft",
            is_active: true,
            created_at: "",
            published_at: "",
        },
        availability: [],
        images: [],
        cancellation_policy: [],
        accommodations: [],
        itinerary_days: [],
    });

    return (
        <div className="space-y-6 pb-24">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold">
                        {itineraryData ? "Edit Itinerary" : "Create Itinerary"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Step {step} of {totalSteps}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(true)}
                        className="gap-2 border-[#00AFEF] text-[#00AFEF]"
                    >
                        <Eye className="h-4 w-4" />
                        Preview
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCancel}
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                </div>
            </div>

            <div className="sticky top-0 z-40 bg-white py-6">
                <div className="relative w-full max-w-8xl mx-auto">

                    <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200" />

                    <div
                        className="absolute top-5 left-0 h-[2px] bg-[#00AFEF] transition-all duration-300"
                        style={{
                            width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                        }}
                    />

                    {/* STEPS */}
                    <div className="relative flex justify-between">
                        {steps.map((s) => {
                            const isActive = step === s.id;
                            const isCompleted = step > s.id;

                            return (
                                <div
                                    key={s.id}
                                    onClick={() => setStep(s.id)}
                                    className="flex flex-col items-center cursor-pointer"
                                >
                                    {/* CIRCLE */}
                                    <div
                                        className={`
                h-10 w-10 flex items-center justify-center rounded-full border-2 z-10 transition-all
                ${isCompleted
                                                ? "bg-[#00AFEF] border-[#00AFEF] text-white"
                                                : isActive
                                                    ? "border-[#00AFEF] text-[#00AFEF] bg-white"
                                                    : "border-gray-300 text-gray-400 bg-white"
                                            }
              `}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            s.id
                                        )}
                                    </div>

                                    {/* LABEL */}
                                    <span
                                        className={`text-xs mt-2 ${isActive
                                            ? "text-[#00AFEF] font-medium"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {step === 1 && (
                <Step1PackageInfo
                    data={formData.tour}
                    setData={(updated) =>
                        setFormData({ ...formData, tour: updated })
                    }
                />
            )}

            {step === 2 && (
                <Step2ItineraryDays
                    data={formData.itinerary_days}
                    setData={(updated) =>
                        setFormData({ ...formData, itinerary_days: updated })
                    }
                />
            )}

            {step === 3 && (
                <Step3Accommodation
                    data={formData.accommodations}
                    setData={(updated) =>
                        setFormData({ ...formData, accommodations: updated })
                    }
                />
            )}

            {step === 4 && (
                <Step4Availability
                    data={formData.availability}
                    setData={(updated) =>
                        setFormData({ ...formData, availability: updated })
                    }
                />
            )}

            {step === 5 && (
                <Step5CancellationPolicy
                    data={formData.cancellation_policy}
                    setData={(updated) =>
                        setFormData({
                            ...formData,
                            cancellation_policy: updated,
                        })
                    }
                />
            )}

            <TourPreview
                open={showPreview}
                onClose={() => setShowPreview(false)}
                data={formData}
            />

            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3">
                <Button
                    variant="outline"
                    onClick={back}
                    disabled={step === 1}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <Button
                    onClick={next}
                    className="bg-[#00AFEF] hover:bg-[#0095cc] text-white gap-2"
                >
                    {step === totalSteps ? (
                        <>
                            <Check className="h-4 w-4" />
                            Finish
                        </>
                    ) : (
                        <>
                            Next
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}