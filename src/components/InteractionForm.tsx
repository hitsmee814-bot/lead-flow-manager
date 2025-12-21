import { useEffect, useState } from "react";
import { Lead } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { RequiredLabel } from "./RequiredLable";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { DateTimePicker } from "./custom/DateTimePicker";
import { apiFetch } from "@/util/apiClient";
import { getSessionCookie } from "@/util/authCookies";

interface LeadUpdateFormProps {
    lead: any;
    onSuccess?: () => void;
}


export const InteractionForm = ({ lead, onSuccess }: LeadUpdateFormProps) => {
    const getUserId = (): number => {
        const userId = getSessionCookie("user_id");
        return userId ? Number(userId) : 0;
    };

    const [travellerGroups, setTravellerGroups] = useState<
        { id: string; group_type: string }[]
    >([]);
    const [leadStatusList, setLeadStatusList] = useState<
        { lead_status_id: string; status: string }[]
    >([]);
    const [priorities, setPriorities] = useState<
        { id: string; priority: string }[]
    >([]);
    const [professions, setProfessions] = useState<
        { unique_key: number; profession_name: string; profession_category: string }[]
    >([]);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const initialFormData = {
        kind: "call",
        direction: "incoming",
        occurred_at: "",
        summary: "",
        changed_by: getUserId(),
        category: "",
        next_call_date_time: "",
        age: lead.age || "",
        profession: "",
        traveller: "",
        budget: "",
        currency: "INR",
        start_time_of_interaction: "",
        end_time_of_interaction: "",
        dtls_interaction: "",
        summary_interaction: "",
        next_actions: "",
    };
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState<boolean>(false);



    const validateForm = () => {
        const newErrors: Record<string, boolean> = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (value === "" || value === null) newErrors[key] = true;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                const res = await apiFetch("/professions");
                const data = await res
                setProfessions(data.professions || []);
            } catch (err) {
                console.error("Failed to fetch professions", err);
            }
        };

        fetchProfessions();
    }, []);


    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                const res = await apiFetch("/priority_details");
                const data = await res
                setPriorities(data.priority_details || []);
            } catch (err) {
                console.error("Failed to fetch priority details", err);
            }
        };

        fetchPriorities();
    }, []);


    useEffect(() => {
        const fetchTravellerGroups = async () => {
            try {
                const res = await apiFetch("/traveller_group");
                const data = await res
                setTravellerGroups(data.traveller_group || []);
            } catch (err) {
                console.error("Failed to fetch traveller groups", err);
            }
        };

        fetchTravellerGroups();
    }, []);

    useEffect(() => {
        const fetchLeadStatus = async () => {
            try {
                const res = await apiFetch("/lead_status");
                const data = await res
                setLeadStatusList(data.lead_status || []);
            } catch (err) {
                console.error("Failed to fetch lead status", err);
            }
        };

        fetchLeadStatus();
    }, []);


    const formatRequiredLabel = (str: string) =>
        str.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());


    const calcDurationSeconds = () => {
        if (!formData.start_time_of_interaction || !formData.end_time_of_interaction)
            return 0;

        const start = new Date(formData.start_time_of_interaction);
        const end = new Date(formData.end_time_of_interaction);
        return Math.floor((end.getTime() - start.getTime()) / 1000);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please fill all mandatory fields",
                className: "border-red-500 bg-red-50 text-red-900",
            });
            return;
        }
        setLoading(true);
        const payload = {
            id: Math.floor(Math.random() * 1000000),
            lead_id: lead.id,
            kind: formData.kind,
            direction: formData.direction,
            occurred_at: formData.occurred_at,
            summary: formData.summary,
            changed_by: formData.changed_by || null,
            category: Number(formData.category),
            next_call_date_time: formData.next_call_date_time,
            age: Number(formData.age),
            profession: Number(formData.profession),
            traveller: Number(formData.traveller),
            budget: Number(formData.budget),
            currency: formData.currency,
            start_time_of_interaction: formData.start_time_of_interaction,
            end_time_of_interaction: formData.end_time_of_interaction,
            dur_interaction_seconds: calcDurationSeconds(),
            dtls_interaction: formData.dtls_interaction,
            summary_interaction: formData.summary_interaction,
            next_actions: formData.next_actions,
            raw_payload: "{}",
        };

        console.log("FINAL PAYLOAD →", payload);

        try {
            const res = await apiFetch("/lead_interactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res

            if (!res.id) {
                console.error("API Error:", data);
                toast({
                    title: "Error",
                    description: "Failed to save interaction. Please try again.",
                    className: "border-red-500 bg-red-50 text-red-900",
                });
                setLoading(false);
                return;
            }

            console.log("Interaction saved successfully →", data);
            toast({
                title: "Success",
                description: "Interaction saved successfully!",
                className: "border-green-500 bg-green-50 text-green-900",
            });
            setLoading(false);
            setFormData(initialFormData);
            onSuccess?.();
        } catch (error) {
            console.error("Network/Server error:", error);
            toast({
                title: "Error",
                description: "Something went wrong while saving.",
                className: "border-red-500 bg-red-50 text-red-900",
            });
            setLoading(false);
        }
    };
    const errorClass = (field: string) => errors[field] ? "border-red-500" : "";



    return (
        <div className="flex flex-col h-full ml-2 mt-4">
            <form id="leadForm" onSubmit={handleSubmit} className="space-y-6 pb-24 pr-4">
                <h3 className="text-lg font-semibold">Interaction Details</h3>

                <div>
                    <RequiredLabel>Kind</RequiredLabel>
                    <Select
                        value={formData.kind}
                        onValueChange={(v) => setFormData({ ...formData, kind: v })}
                    >
                        <SelectTrigger className={errorClass("kind")}>
                            <SelectValue placeholder="Select kind" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="call">Call</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <RequiredLabel>Direction</RequiredLabel>
                    <Select
                        value={formData.direction}
                        onValueChange={(v) => setFormData({ ...formData, direction: v })}
                    >
                        <SelectTrigger className={errorClass("direction")}>
                            <SelectValue placeholder="Incoming / Outgoing" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="incoming">Incoming</SelectItem>
                            <SelectItem value="outgoing">Outgoing</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <RequiredLabel>Occurred At</RequiredLabel>
                    <DateTimePicker
                        className={errorClass("occurred_at")}
                        value={formData.occurred_at}
                        onChange={(val) => setFormData({ ...formData, occurred_at: val })}
                        max={new Date().toISOString()}
                    />
                </div>

                <div>
                    <RequiredLabel>Summary</RequiredLabel>
                    <Textarea
                        className={errorClass("summary")}
                        value={formData.summary}
                        placeholder="Give a summary of the interaction"
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    />
                </div>

                <div>
                    <RequiredLabel>Category</RequiredLabel>
                    <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                        <SelectTrigger className={errorClass("category")}>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Hot</SelectItem>
                            <SelectItem value="2">Warm</SelectItem>
                            <SelectItem value="3">Cold</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <RequiredLabel>Next Call Date/Time</RequiredLabel>
                    <DateTimePicker
                        className={errorClass("next_call_date_time")}
                        value={formData.next_call_date_time}
                        min={new Date()}
                        onChange={(val) =>
                            setFormData({ ...formData, next_call_date_time: val })
                        }
                    />

                </div>

                <div>
                    <RequiredLabel>Age</RequiredLabel>
                    <Input
                        type="number"
                        className={errorClass("age")}
                        value={formData.age}
                        placeholder="Age of the person you interacted with"
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                </div>

                <div>
                    <RequiredLabel>Profession</RequiredLabel>
                    <Select
                        value={formData.profession}
                        onValueChange={(v) => setFormData({ ...formData, profession: v })}
                    >
                        <SelectTrigger className={errorClass("profession")}>
                            <SelectValue placeholder="Select Profession" />
                        </SelectTrigger>
                        <SelectContent>
                            {professions.map((p) => (
                                <SelectItem key={p.unique_key} value={String(p.unique_key)}>
                                    {p.profession_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <RequiredLabel>Traveller Type</RequiredLabel>
                    <Select
                        value={formData.traveller}
                        onValueChange={(v) => setFormData({ ...formData, traveller: v })}
                    >
                        <SelectTrigger className={errorClass("traveller")}>
                            <SelectValue placeholder="Select Traveller Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {travellerGroups.map((group) => (
                                <SelectItem key={group.id} value={group.id}>
                                    {formatRequiredLabel(group.group_type)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <RequiredLabel>Budget</RequiredLabel>
                    <Input
                        type="number"
                        className={errorClass("budget")}
                        value={formData.budget}
                        placeholder="What is the budget of the client"
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                </div>

                <div>
                    <RequiredLabel>Currency</RequiredLabel>
                    <Select
                        value={formData.currency}
                        onValueChange={(v) => setFormData({ ...formData, currency: v })}
                    >
                        <SelectTrigger className={errorClass("currency")}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INR">Rupees (INR)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <RequiredLabel>Start Time of Interaction</RequiredLabel>
                    <DateTimePicker
                        className={errorClass("start_time_of_interaction")}
                        value={formData.start_time_of_interaction}
                        onChange={(val) =>
                            setFormData({ ...formData, start_time_of_interaction: val })
                        }
                    />
                </div>

                <div>
                    <RequiredLabel>End Time of Interaction</RequiredLabel>
                    <DateTimePicker
                        className={errorClass("end_time_of_interaction")}
                        value={formData.end_time_of_interaction}
                        onChange={(val) =>
                            setFormData({ ...formData, end_time_of_interaction: val })
                        }
                    />
                </div>

                <div>
                    <RequiredLabel>Detailed Notes</RequiredLabel>
                    <Textarea
                        className={errorClass("dtls_interaction")}
                        value={formData.dtls_interaction}
                        placeholder="Any detailed notes or important point in the conversation"
                        onChange={(e) => setFormData({ ...formData, dtls_interaction: e.target.value })}
                    />
                </div>

                <div>
                    <RequiredLabel>Interaction Summary</RequiredLabel>
                    <Select
                        value={formData.summary_interaction}
                        onValueChange={(v) => setFormData({ ...formData, summary_interaction: v })}
                    >
                        <SelectTrigger className={errorClass("summary_interaction")}>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="High intent">High Intent</SelectItem>
                            <SelectItem value="Medium intent">Medium Intent</SelectItem>
                            <SelectItem value="Low intent">Low Intent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <RequiredLabel>Next Actions</RequiredLabel>
                    <Input
                        className={errorClass("next_actions")}
                        value={formData.next_actions}
                        placeholder="What is the next action?"
                        onChange={(e) => setFormData({ ...formData, next_actions: e.target.value })}
                    />
                </div>
            </form>


            <div className="sticky bottom-0 bg-background py-3 pr-4">
                <Button type="submit" form="leadForm" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>
            {loading && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                    <p className="text-white mt-3 text-sm">Saving interaction…</p>
                </div>
            )}

        </div>
    );
};
