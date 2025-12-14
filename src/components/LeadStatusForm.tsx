import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { RequiredLabel } from "./RequiredLable";
import { Loader2 } from "lucide-react";
export const LeadStatusForm = ({ lead }) => {
    const [leadStatusList, setLeadStatusList] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchLeadStatus = async () => {
            try {
                const res = await fetch("http://150.241.244.100:51800/lead_status");
                const data = await res.json();
                setLeadStatusList(data.lead_status || []);
            } catch (err) {
                console.error("Failed to fetch lead statuses:", err);
            }
        };
        fetchLeadStatus();
    }, []);

    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                const res = await fetch("http://150.241.244.100:51800/priority_details");
                const data = await res.json();
                setPriorities(data.priority_details || []);
            } catch (err) {
                console.error("Failed to fetch priorities:", err);
            }
        };
        fetchPriorities();
    }, []);

    // Helper: get status label from ID
    const getStatusLabel = (statusId) => {
        const status = leadStatusList.find(
            (s) => String(s.lead_status_id) === String(statusId)
        );
        return status ? status.status : "";
    };

    const [statusData, setStatusData] = useState({
        old_status: { id: "", label: "" },
        new_status: "",
        reason: "",
        priority: "",
        on_hold: false,
        re_engage_date: "",
        follow_up_stage: "",
        changed_by: 1001,
    });

    useEffect(() => {
        if (leadStatusList.length > 0) {
            const lastStatusId = lead.history?.new_status || lead.status;
            setStatusData((prev) => ({
                ...prev,
                old_status: { id: lastStatusId, label: getStatusLabel(lastStatusId) },
            }));
        }
    }, [leadStatusList, lead]);

    const errorClass = (field) =>
        errors[field] ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

    const validate = () => {
        const newErrors: any = {};
        if (!statusData.new_status) newErrors.new_status = true;
        if (!statusData.reason.trim()) newErrors.reason = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast({
                title: "Validation Error",
                description: "Please fill all mandatory fields",
                className: "border-red-500 bg-red-50 text-red-900",
            }); return;
        }
        setLoading(true);
        const payload = {
            id: Math.floor(Math.random() * 1000000),
            lead_id: lead.id,
            old_status: Number(statusData.old_status.id), // send ID
            new_status: Number(statusData.new_status),
            reason: statusData.reason,
            priority: Number(statusData.priority || 0),
            changed_by: 1001,
            on_hold: statusData.on_hold,
            re_engage_date: statusData.re_engage_date,
            follow_up_stage: Number(statusData.follow_up_stage || 0),
            created_at: new Date().toISOString(),
        };

        try {
            const res = await fetch(
                "http://150.241.244.100:51800/leads_status_history",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            const data = await res.json();

            if (!res.ok) {
                toast({
                    title: "Save Failed",
                    description: data.error || "Failed to save status",
                    className: "border-red-500 bg-red-50 text-red-900",
                });
                setLoading(false);

            } else {
                toast({
                    title: "Success",
                    description: "Status updated successfully!",
                    className: "border-green-500 bg-green-50 text-green-900",
                });
                setStatusData({
                    old_status: {
                        id: statusData.new_status,
                        label: getStatusLabel(statusData.new_status),
                    },
                    new_status: "",
                    reason: "",
                    priority: "",
                    on_hold: false,
                    re_engage_date: "",
                    follow_up_stage: "",
                    changed_by: 1001,
                });
                setErrors({});
                setLoading(false);

            }
        } catch (err) {
            console.error("Request failed:", err);
            toast({
                title: "Save Failed",
                description: "Network Error",
                className: "border-red-500 bg-red-50 text-red-900",
            }); 
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full ml-2">
            <form onSubmit={handleSubmit} id="statusForm" className="space-y-6 pb-24 pr-4">
                <h3 className="text-lg font-semibold">Status Update</h3>

                <div>
                    <RequiredLabel>Old Status</RequiredLabel>
                    <Input disabled value={statusData.old_status.label} />
                </div>

                <div>
                    <RequiredLabel>
                        New
                    </RequiredLabel>
                    <Select
                        value={statusData.new_status}
                        onValueChange={(v) => setStatusData({ ...statusData, new_status: v })}
                    >
                        <SelectTrigger className={errorClass("new_status")}>
                            <SelectValue placeholder="Select New Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {leadStatusList.map((s) => (
                                <SelectItem key={s.lead_status_id} value={String(s.lead_status_id)}>
                                    {s.status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <RequiredLabel>
                        Reason
                    </RequiredLabel>
                    <Input
                        className={errorClass("reason")}
                        value={statusData.reason}
                        placeholder="Give reason of status update."
                        onChange={(e) =>
                            setStatusData({ ...statusData, reason: e.target.value })
                        }
                    />
                </div>

                <div>
                    <RequiredLabel>Priority</RequiredLabel>
                    <Select
                        value={statusData.priority}
                        onValueChange={(v) =>
                            setStatusData({ ...statusData, priority: v })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            {priorities.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                    {p.priority.charAt(0).toUpperCase() + p.priority.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <RequiredLabel>Re-engage Date</RequiredLabel>
                    <Input
                        type="date"
                        value={statusData.re_engage_date}
                        onChange={(e) =>
                            setStatusData({ ...statusData, re_engage_date: e.target.value })
                        }
                    />
                </div>

                <div>
                    <RequiredLabel>Follow-up Stage</RequiredLabel>
                    <Input
                        type="number"
                        value={statusData.follow_up_stage}
                        placeholder="Stage number of follow up, give 1 if not sure."
                        onChange={(e) =>
                            setStatusData({ ...statusData, follow_up_stage: e.target.value })
                        }
                    />
                </div>

                <div>
                    <RequiredLabel>Changed By</RequiredLabel>
                    <Input disabled value={statusData.changed_by} />
                </div>
            </form>

            <div className="sticky bottom-0 border-t bg-background py-3 pr-4">
                <Button type="submit" form="statusForm" className="w-full">
                    Save Status Update
                </Button>
            </div>
            {loading && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                    <p className="text-white mt-3 text-sm">Saving status</p>
                </div>
            )}
        </div>
    );
};
