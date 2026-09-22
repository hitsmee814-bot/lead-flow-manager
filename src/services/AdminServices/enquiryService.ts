import { apiFetch } from "@/util/apiClient";

export type EnquirySource =
    | "CUSTOMER"
    | "SUPPLIER"
    | "AGENT"
    | "ADMIN";

export type Enquiry = {
    id: number;
    enquiry_no: string;
    source: string;
    enquiry_type: string;
    subject: string | null;
    service_type: string | null;
    destination: string | null;
    travel_date: string | null;
    passengers: string | null;
    budget: number | null;
    description: string | null;
    status: string;
    next_followup: string | null;
    created_at: string;
    updated_at: string | null;
    recipient_type: string | null;
    recipient_id: number | null;
    recipient_email: string | null;
    assigned_to: number | null;
    created_by: number | null;
    updated_by: number | null;
    service_request_no: string | null;
    has_service_requests: boolean;
    supplier_name: string | null;
    demand_request_id: number | null;
};

export type EnquiryListResponse = {
    items: Enquiry[];
    page: number;
    size: number;
    count: number;
};

export const enquiryService = {
    getEnquiries: (
        source: EnquirySource,
        status: string = "All",
        page: number = 1,
        size: number = 20
    ) => {
        const params = new URLSearchParams({
            source,
            page: String(page),
            size: String(size),
        });

        if (status !== "All") {
            params.append("status", status);
        }

        return apiFetch<EnquiryListResponse>(
            `/admin/enquiries?${params.toString()}`
        );
    },
};