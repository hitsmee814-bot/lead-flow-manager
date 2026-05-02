"use client";

import { useEffect, useState } from "react";
import Step1PackageInfo from "./steps/Step1/Step1PackageInfo";
import Step2ItineraryDays from "./steps/Step2/Step2ItineraryDays";
import Step3Accommodation from "./steps/Step3/Step3Accommodation";
import Step4Availability from "./steps/Step4/Step4Availability";
import Step5CancellationPolicy from "./steps/Step5/Step5CancellationPolicy";
import TourPreview from "./Preview";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Props = {
    onCancel: () => void;
    onSuccess?: () => void; // 👈 add this
    itineraryData?: any;
};
const imageCache = new Map<string, string>();


export default function ItineraryBuilder({
    onCancel,
    onSuccess,
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingText, setLoadingText] = useState("Saving...");
    const isEdit = !!itineraryData?.tour?.id;
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
                id: d.id ? String(d.id) : crypto.randomUUID(),
                day_number: d.day_number,
                date: d.date ?? "",

                title: d.title ?? "",
                description: d.description ?? "",

                // ✅ FIXED
                hotel: d.hotel_name ?? "",
                distance: d.distance_km ? String(d.distance_km) : "",
                travelTime: d.travel_time ?? "",

                // optional if you support later
                from: d.from ?? "",
                to: d.to ?? "",

                activities: (d.activities ?? []).map((a: any) => ({
                    id: String(a.id),
                    name: a.name,
                    type: a.type,
                    description: a.description,
                    latitude: String(a.latitude),
                    longitude: String(a.longitude),
                })),

                images: d.images ?? [],
            }))
        };
    });

    useEffect(() => {
        if (!itineraryData) return;
        const loadAllImages = async () => {
            if (!itineraryData) return;

            // 🔹 TOUR IMAGES
            const mappedTourImages = await Promise.all(
                (itineraryData.images || []).map(async (img: any) => {
                    const preview = img.preview || (img.image_url
                        ? await getImagePreview(img.image_url)
                        : null);

                    return {
                        id: String(img.id),
                        file: null,
                        preview,
                        image_url: img.image_url,
                        caption: img.caption || "",
                        is_cover: img.is_cover || false,
                        document_type: img.document_type || "",
                    };
                })
            );

            // 🔹 ITINERARY DAY IMAGES
            const mappedDays = await Promise.all(
                (itineraryData.itinerary_days || []).map(async (day: any) => {
                    const mappedImages = await Promise.all(
                        (day.images || []).map(async (img: any) => {
                            const preview = img.preview || (img.image_url
                                ? await getImagePreview(img.image_url)
                                : null);

                            return {
                                id: String(img.id),
                                file: null,
                                preview,
                                image_url: img.image_url,
                                caption: img.caption || "",
                                document_type: img.document_type || "",
                            };
                        })
                    );

                    return {
                        ...day,
                        images: mappedImages,
                    };
                })
            );

            setFormData((prev: any) => ({
                ...prev,
                tour: {
                    ...prev.tour,
                    images: mappedTourImages,
                },
                itinerary_days: mappedDays,
            }));
        };

        loadAllImages();
    }, []);

    // useEffect(() => {
    //     return () => {
    //         formData.tour.images?.forEach((img: any) => {
    //             if (img.preview) URL.revokeObjectURL(img.preview);
    //         });

    //         formData.itinerary_days?.forEach((d: any) => {
    //             d.images?.forEach((img: any) => {
    //                 if (img.preview) URL.revokeObjectURL(img.preview);
    //             });
    //         });
    //     };
    // }, []);

    const getImagePreview = async (filename: string) => {
        if (imageCache.has(filename)) {
            return imageCache.get(filename);
        }

        try {
            const res = await fetch(
                `https://ascendus.bonhomiee.com/files/download?filename=${encodeURIComponent(filename)}`
            );

            if (!res.ok) throw new Error("Failed");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            imageCache.set(filename, url); // ✅ cache it

            return url;
        } catch (err) {
            console.error("Preview failed:", err);
            return null;
        }
    };
    const totalSteps = steps.length;
    const validateStep1 = () => {
        const t = formData.tour;

        if (!t.start_date) return "Start date is required";
        if (!t.end_date) return "End date is required";


        if (!t.title?.trim()) return "Tour title is required";
        if (!t.description?.trim()) return "Description is required";
        if (!t.origin_city?.trim()) return "Origin city is required";
        if (!t.destination?.trim()) return "Destination is required";

        if (t.base_price === "" || t.base_price == null || t.base_price <= 0)
            return "Base price must be greater than 0";

        if (!t.currency) return "Currency is required";

        if (t.max_guests === "" || t.max_guests == null || t.max_guests <= 0)
            return "Max guests must be at least 1";

        if (!t.status) return "Status is required";

        const images = formData.tour.images || [];

        const invalidImage = images.find(
            (img: any) => !img.caption || !img.caption.trim() || !img.document_type
        );

        if (invalidImage) {
            return "All uploaded images must have a caption";
        }

        return null;
    };
    const validateStep2 = () => {
        if (formData.itinerary_days.length === 0)
            return "Add at least one itinerary day";

        for (let i = 0; i < formData.itinerary_days.length; i++) {
            const d = formData.itinerary_days[i];

            if (!d.title?.trim())
                return `Day ${i + 1}: title is required`;

            if (!d.description?.trim())
                return `Day ${i + 1}: description is required`;

            if (!d.date)
                return `Day ${i + 1}: date is required`;

            // // activities check
            // if (!d.activities || d.activities.length === 0)
            //     return `Day ${i + 1}: add at least one activity`;

            for (let j = 0; j < d.activities.length; j++) {
                const a = d.activities[j];

                if (!a.name?.trim())
                    return `Day ${i + 1}, Activity ${j + 1}: name required`;

                if (!a.type)
                    return `Day ${i + 1}, Activity ${j + 1}: type required`;

                if (!a.description?.trim())
                    return `Day ${i + 1}, Activity ${j + 1}: description required`;

                if (a.latitude === "" || a.latitude == null || isNaN(Number(a.latitude)))
                    return `Day ${i + 1}, Activity ${j + 1}: valid latitude required`;

                if (a.longitude === "" || a.longitude == null || isNaN(Number(a.longitude)))
                    return `Day ${i + 1}, Activity ${j + 1}: valid longitude required`;
            }

            // images + caption validation
            if (d.images?.length) {
                const invalidImage = d.images.find(
                    (img: any) => !img.caption?.trim() || !img.document_type
                );

                if (invalidImage)
                    return `Day ${i + 1}: all images must have captions`;
            }
        }

        return null;
    };

    const validateAccommodation = () => {
        if (formData.accommodations.length === 0)
            return "Add at least one hotel";

        for (let i = 0; i < formData.accommodations.length; i++) {
            const h = formData.accommodations[i];

            if (!h.hotel_name.trim())
                return `Hotel ${i + 1}: name required`;

            if (!h.location.trim())
                return `Hotel ${i + 1}: location required`;

            if (!h.nights || h.nights <= 0)
                return `Hotel ${i + 1}: nights must be > 0`;

            if (!h.meal_plan)
                return `Hotel ${i + 1}: meal plan required`;
        }

        return null;
    };

    const validateAvailability = () => {
        if (formData.availability.length === 0)
            return "Add at least one availability slot";

        for (let i = 0; i < formData.availability.length; i++) {
            const a = formData.availability[i];

            if (!a.start_date) return `Slot ${i + 1}: start date required`;
            if (!a.end_date) return `Slot ${i + 1}: end date required`;

            if (new Date(a.end_date) < new Date(a.start_date))
                return `Slot ${i + 1}: end date cannot be before start date`;

            if (!a.price || a.price <= 0)
                return `Slot ${i + 1}: price must be > 0`;

            if (!a.total_slots || a.total_slots <= 0)
                return `Slot ${i + 1}: total slots must be > 0`;
        }

        return null;
    };


    const validatePolicy = () => {
        if (formData.cancellation_policy.length === 0)
            return "Add at least one cancellation rule";

        for (let i = 0; i < formData.cancellation_policy.length; i++) {
            const p = formData.cancellation_policy[i];

            if (p.days_before === "" || p.days_before == null)
                return `Rule ${i + 1}: days before required`;

            if (p.days_before < 0)
                return `Rule ${i + 1}: days cannot be negative`;

            if (
                p.refund_percentage == null ||
                p.refund_percentage < 0 ||
                p.refund_percentage > 100
            )
                return `Rule ${i + 1}: refund must be 0–100`;
        }

        return null;
    };

    // const submitItinerary = async () => {
    //     try {
    //         toast({ title: "Creating itinerary..." });

    //         // 🔹 STEP 1: CREATE (no images)
    //         const createPayload: any = {
    //             tour: {
    //                 title: formData.tour.title,
    //                 description: formData.tour.description,
    //                 duration_days: formData.tour.duration_days,
    //                 duration_nights: formData.tour.duration_nights,
    //                 start_date: formData.tour.start_date,
    //                 end_date: formData.tour.end_date,
    //                 origin_city: formData.tour.origin_city,
    //                 destination: formData.tour.destination,
    //                 base_price: Number(formData.tour.base_price),
    //                 currency: formData.tour.currency,
    //                 max_guests: Number(formData.tour.max_guests),
    //             },

    //             itinerary_days: formData.itinerary_days.map((d: any) => ({
    //                 date: d.date,
    //                 day_number: Number(d.day_number),
    //                 title: d.title,
    //                 description: d.description,
    //                 hotel_name: d.hotel,
    //                 distance_km: d.distance ? Number(d.distance) : 0,
    //                 travel_time: d.travelTime || "",
    //                 activities: [],
    //                 images: [],
    //             })),
    //         };

    //         if (formData.availability?.length > 0) {
    //             createPayload.availability = formData.availability;
    //         }

    //         if (formData.cancellation_policy?.length > 0) {
    //             createPayload.cancellation_policy = formData.cancellation_policy;
    //         }

    //         if (formData.accommodations?.length > 0) {
    //             createPayload.accommodations = formData.accommodations;
    //         }

    //         // if (formData.tour.images?.length > 0) {
    //         //     createPayload.images = formData.images;
    //         // }

    //         console.log("📤 CREATE payload:", createPayload);

    //         const createRes = await fetch(
    //             "https://ascendus.bonhomiee.com/itinerary/create",
    //             {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(createPayload),
    //             }
    //         );

    //         const createData = await createRes.json();

    //         if (!createRes.ok) {
    //             throw new Error(createData?.message || "Create failed");
    //         }

    //         const tourId = createData.tour_id;
    //         console.log("✅ Created tour:", tourId);

    //         toast({ title: "Uploading images..." });

    //         // 🔹 STEP 2: UPLOAD IMAGES
    //         const { uploadedTourImages, uploadedDayImages } =
    //             await uploadAllImages(tourId);

    //         console.log("📦 Uploaded images:", {
    //             uploadedTourImages,
    //             uploadedDayImages,
    //         });

    //         // 🔹 STEP 3: UPDATE with images
    //         const updatePayload = {
    //             tour: {
    //                 title: formData.tour.title,
    //                 description: formData.tour.description,
    //                 duration_days: formData.tour.duration_days,
    //                 duration_nights: formData.tour.duration_nights,
    //                 start_date: formData.tour.start_date,
    //                 end_date: formData.tour.end_date,
    //                 origin_city: formData.tour.origin_city,
    //                 destination: formData.tour.destination,
    //                 base_price: Number(formData.tour.base_price),
    //                 currency: formData.tour.currency,
    //                 max_guests: Number(formData.tour.max_guests),
    //             },

    //             images: uploadedTourImages.map((img: any) => ({
    //                 image_url: img.image_url || img.url,   // 🔥 IMPORTANT
    //                 caption: img.caption,
    //                 document_type: img.document_type,
    //                 is_cover: img.is_cover || false,
    //             })),

    //             itinerary_days: formData.itinerary_days.map((d: any) => {
    //                 const found = uploadedDayImages.find(
    //                     (x) => x.day_number === d.day_number
    //                 );

    //                 return {
    //                     date: d.date,
    //                     day_number: d.day_number,
    //                     title: d.title,
    //                     description: d.description,
    //                     hotel_name: d.hotel || "",
    //                     distance_km: d.distance ? Number(d.distance) : 0,
    //                     travel_time: d.travelTime || "",

    //                     activities: (d.activities || []).map((a: any) => ({
    //                         name: a.name,
    //                         type: a.type,
    //                         description: a.description,
    //                         latitude: Number(a.latitude),
    //                         longitude: Number(a.longitude),
    //                     })),

    //                     images: (found?.images || []).map((img: any) => ({
    //                         image_url: img.image_url || img.url,   // 🔥 scan-upload result
    //                         caption: img.caption,
    //                         document_type: img.document_type,
    //                         is_cover: img.is_cover || false,
    //                     })),
    //                 };
    //             }),

    //             availability: formData.availability || [],
    //             cancellation_policy: formData.cancellation_policy || [],
    //             accommodations: formData.accommodations || [],
    //         };

    //         console.log("📤 UPDATE payload:", updatePayload);

    //         const updateRes = await fetch(
    //             `https://ascendus.bonhomiee.com/itinerary/update/${tourId}`,
    //             {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(updatePayload),
    //             }
    //         );

    //         const updateData = await updateRes.json();

    //         if (!updateRes.ok) {
    //             throw new Error(updateData?.message || "Update failed");
    //         }

    //         console.log("✅ FINAL SUCCESS");

    //         toast({
    //             title: "Itinerary created 🎉",
    //             description: "All images uploaded successfully",
    //             className: "border-green-500 bg-green-50 text-green-900",
    //         });
    //         onSuccess?.();
    //         onCancel();

    //     } catch (err: any) {
    //         console.error("❌ FLOW FAILED:", err);

    //         toast({
    //             title: "Process failed",
    //             description: err.message || "Something went wrong",
    //             className: "border-red-500 bg-red-50 text-red-900",
    //         });
    //     }
    // };
    const submitItinerary = async () => {
        try {
            setIsSubmitting(true);
            setLoadingText("Preparing data...");

            const isEditMode = !!formData.tour.id;
            const tourId = formData.tour.id;

            let finalTourId = tourId;

            // =========================
            // 🆕 CREATE FLOW
            // =========================
            if (!isEditMode) {
                setLoadingText("Creating itinerary...");

                toast({ title: "Creating itinerary..." });

                const createPayload: any = {
                    tour: {
                        title: formData.tour.title,
                        description: formData.tour.description,
                        duration_days: formData.tour.duration_days,
                        duration_nights: formData.tour.duration_nights,
                        start_date: formData.tour.start_date,
                        end_date: formData.tour.end_date,
                        origin_city: formData.tour.origin_city,
                        destination: formData.tour.destination,
                        base_price: Number(formData.tour.base_price),
                        currency: formData.tour.currency,
                        max_guests: Number(formData.tour.max_guests),
                    },
                    itinerary_days: formData.itinerary_days.map((d: any) => ({
                        date: d.date,
                        day_number: Number(d.day_number),
                        title: d.title,
                        description: d.description,
                        hotel_name: d.hotel_name,
                        distance_km: d.distance_km ? Number(d.distance_km) : 0,
                        travel_time: d.travel_time || "",
                        activities: [],
                        images: [],
                    })),
                    availability: formData.availability || [],
                    cancellation_policy: formData.cancellation_policy || [],
                    accommodations: formData.accommodations || [],
                };

                const res = await fetch(
                    "https://ascendus.bonhomiee.com/itinerary/create",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(createPayload),
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.message || "Create failed");
                }

                finalTourId = data.tour_id;
            }

            // =========================
            // 📤 IMAGE UPLOAD (both modes)
            // =========================
            toast({ title: "Uploading images..." });
            setLoadingText("Uploading images...");

            const { uploadedTourImages, uploadedDayImages } =
                await uploadAllImages(finalTourId);

            const existingTourImages = (formData.tour.images || [])
                .filter((img: any) => !img.file)
                .map((img: any) => ({
                    image_url: img.image_url,
                    caption: img.caption,
                    document_type: img.document_type,
                    is_cover: img.is_cover || false,
                }));

            const newTourImages = uploadedTourImages.map((img: any) => ({
                image_url: img.image_url,
                caption: img.caption,
                document_type: img.document_type,
                is_cover: img.is_cover || false,
            }));

            const mergedTourImages = [...existingTourImages, ...newTourImages];
            setLoadingText("Saving itinerary...");

            // =========================
            // 🔁 UPDATE (both modes)
            // =========================
            const updatePayload = {
                tour: {
                    title: formData.tour.title,
                    description: formData.tour.description,
                    duration_days: formData.tour.duration_days,
                    duration_nights: formData.tour.duration_nights,
                    start_date: formData.tour.start_date,
                    end_date: formData.tour.end_date,
                    origin_city: formData.tour.origin_city,
                    destination: formData.tour.destination,
                    base_price: Number(formData.tour.base_price),
                    currency: formData.tour.currency,
                    max_guests: Number(formData.tour.max_guests),
                },

                images: mergedTourImages,

                itinerary_days: formData.itinerary_days.map((d: any) => {
                    const found = uploadedDayImages.find(
                        (x) => x.day_number === d.day_number
                    );

                    // ✅ EXISTING (already uploaded images)
                    const existingImages = (d.images || [])
                        .filter((img: any) => !img.file)
                        .map((img: any) => ({
                            image_url: img.image_url,
                            caption: img.caption,
                            document_type: img.document_type,
                            is_cover: img.is_cover || false,
                        }));

                    // ✅ NEW (just uploaded now)
                    const newImages = (found?.images || []).map((img: any) => ({
                        image_url: img.image_url,
                        caption: img.caption,
                        document_type: img.document_type,
                        is_cover: img.is_cover || false,
                    }));

                    return {
                        date: d.date,
                        day_number: d.day_number,
                        title: d.title,
                        description: d.description,
                        hotel_name: d.hotel_name || "",
                        distance_km: d.distance_km ? Number(d.distance_km) : 0,
                        travel_time: d.travel_time || "",

                        activities: (d.activities || []).map((a: any) => ({
                            name: a.name,
                            type: a.type,
                            description: a.description,
                            latitude: Number(a.latitude),
                            longitude: Number(a.longitude),
                        })),

                        images: [...existingImages, ...newImages],
                    };
                }),

                availability: formData.availability || [],
                cancellation_policy: formData.cancellation_policy || [],
                accommodations: formData.accommodations || [],
            };

            const updateRes = await fetch(
                `https://ascendus.bonhomiee.com/itinerary/update/${finalTourId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatePayload),
                }
            );

            const updateData = await updateRes.json();

            if (!updateRes.ok) {
                throw new Error(updateData?.message || "Update failed");
            }

            toast({
                title: isEditMode ? "Itinerary updated ✅" : "Itinerary created 🎉",
                className: "border-green-500 bg-green-50 text-green-900",
            });

            onSuccess?.();
            onCancel();
        } catch (err: any) {
            console.error("❌ FLOW FAILED:", err);

            toast({
                title: "Process failed",
                description: err.message || "Something went wrong",
                className: "border-red-500 bg-red-50 text-red-900",
            });
        } finally {
            setIsSubmitting(false);
            setLoadingText("Saving...");
        }
    };
    const uploadImage = async (file: File, tourId: number, document_type: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tour_id", String(tourId));
        formData.append("document_type", document_type);

        const res = await fetch(
            "https://ascendus.bonhomiee.com/files/scan-upload-itinerary-image",
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();

        if (!res.ok || data.status !== "success") {
            throw new Error("Image upload failed");
        }

        return data.object_name; // ✅ IMPORTANT
    };

    const uploadAllImages = async (tourId: number) => {
        console.log("🚀 Starting image uploads...");

        const uploadedTourImages: any[] = [];
        const uploadedDayImages: any[] = [];

        // 🔹 TOUR IMAGES
        for (const img of formData.tour.images || []) {
            if (!img.file) continue; // skip already uploaded

            try {
                const file_path = await uploadImage(
                    img.file,
                    tourId,
                    img.document_type
                );

                uploadedTourImages.push({
                    image_url: file_path,
                    caption: img.caption,
                    is_cover: img.is_cover || false,
                    document_type: img.document_type
                });

                console.log("✅ Tour image uploaded:", file_path);
            } catch (err) {
                console.error("❌ Tour image failed:", err);
                throw new Error("Tour image upload failed");
            }
        }

        // 🔹 ITINERARY DAY IMAGES
        for (const day of formData.itinerary_days) {
            const dayImages: any[] = [];

            for (const img of day.images || []) {
                if (!img.file) continue;

                try {
                    const file_path = await uploadImage(
                        img.file,
                        tourId,
                        img.document_type
                    );

                    dayImages.push({
                        image_url: file_path,
                        caption: img.caption,
                        document_type: img.document_type,
                        itinerary_day_id: day.day_number
                    });

                    console.log(`✅ Day ${day.day_number} image uploaded`);
                } catch (err) {
                    console.error("❌ Day image failed:", err);
                    throw new Error(`Day ${day.day_number} image upload failed`);
                }
            }

            uploadedDayImages.push({
                day_number: day.day_number,
                images: dayImages,
            });
        }

        return { uploadedTourImages, uploadedDayImages };
    };
    const isStep1Valid = () => !validateStep1();
    const isStep3Valid = () => !validateAccommodation();
    const isStep4Valid = () => !validateAvailability();
    const isStep5Valid = () => !validatePolicy();

    const next = async () => {
        if (step === 1) {
            const error = validateStep1();
            if (error) {
                toast({
                    title: "Missing required fields",
                    description: error,
                    className: "border-red-500 bg-red-50 text-red-900",
                });
                return;
            }
        }

        if (step === 2) {
            const error = validateStep2();
            if (error) {
                toast({
                    title: "Itinerary error",
                    description: error,
                    className: "border-red-500 bg-red-50 text-red-900",
                });
                return;
            }
        }

        if (step === 3) {
            const error = validateAccommodation();
            if (error) {
                toast({
                    title: "Accommodation error",
                    description: error,
                    className: "border-red-500 bg-red-50 text-red-900",
                });
                return;
            }
        }

        if (step === 4) {
            const error = validateAvailability();
            if (error) {
                toast({
                    title: "Availability error",
                    description: error,
                    className: "border-red-500 bg-red-50 text-red-900",
                });
                return;
            }
        }

        if (step === 5) {
            const error = validatePolicy();

            if (error) {
                toast({
                    title: "Invalid cancellation policy",
                    description: error,
                    className: "border-red-500 bg-red-50 text-red-900",
                });
                return;
            }
        }

        if (step < totalSteps) {
            setStep(step + 1);
            return;
        }

        console.log("Submitting payload:", formData);
        await submitItinerary();
    };;

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
                {step > 1 && (
                    <Button
                        variant="outline"
                        onClick={back}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                )}
                <Button
                    onClick={next}
                    disabled={
                        (step === 1 && !isStep1Valid()) ||
                        (step === 2 && !!validateStep2()) ||
                        (step === 3 && !isStep3Valid()) ||
                        (step === 4 && !isStep4Valid()) ||
                        (step === 5 && !isStep5Valid())
                    }
                    className="bg-[#00AFEF] hover:bg-[#0095cc] text-white gap-2"
                >
                    {step === totalSteps ? (
                        <>
                            <Check className="h-4 w-4" />
                            {isEdit ? "Update" : "Create"}
                        </>
                    ) : (
                        <>
                            Next
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
            {isSubmitting && (
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">

                        {/* Spinner ring */}
                        <div className="relative h-16 w-16">
                            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-[#00AFEF] animate-spin"></div>
                        </div>

                        {/* Text */}
                        <div className="text-white text-lg font-medium tracking-wide">
                            {loadingText}
                        </div>

                        {/* subtle subtitle */}
                        <div className="text-white/60 text-sm">
                            Please don’t close this window
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}