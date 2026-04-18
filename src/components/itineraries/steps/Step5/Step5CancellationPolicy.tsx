"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

import { Slider } from "@/components/ui/slider";

type Policy = {
    id: string;
    days_before: number;
    refund_percentage: number;
};

const Label = ({ children }: any) => (
    <label className="text-sm font-medium text-gray-700">
        {children}
    </label>
);

export default function Step5CancellationPolicy({
    data,
    setData,
}: {
    data: Policy[];
    setData: (v: Policy[]) => void;
}) {
    /* ---------------- ADD ---------------- */
    const addPolicy = () => {
        setData([
            ...data,
            {
                id: crypto.randomUUID(),
                days_before: 0,
                refund_percentage: 0,
            },
        ]);
    };

    /* ---------------- UPDATE ---------------- */
    const update = (id: string, key: string, value: any) => {
        setData(
            data.map((item) =>
                item.id === id ? { ...item, [key]: value } : item
            )
        );
    };

    /* ---------------- DELETE ---------------- */
    const remove = (id: string) => {
        setData(data.filter((item) => item.id !== id));
    };

    return (
        <div className="space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">
                        Cancellation Policy
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Define refund rules before departure
                    </p>
                </div>

                <Button
                    onClick={addPolicy}
                    className="bg-[#00AFEF] hover:bg-[#0095cc] text-white gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Rule
                </Button>
            </div>

            {/* EMPTY */}
            {data.length === 0 && (
                <div className="border rounded-xl p-10 text-center text-muted-foreground">
                    No cancellation rules added yet
                </div>
            )}

            {/* LIST */}
            {data.map((item, index) => (
                <Card key={item.id} className="p-5 space-y-5">

                    {/* HEADER */}
                    <div className="flex justify-between items-center">
                        <p className="font-medium">
                            Rule {index + 1}
                        </p>

                        <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => remove(item.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* DAYS BEFORE */}
                        <div className="space-y-1">
                            <Label>Days Before Departure</Label>

                            <Input
                                type="number"
                                value={item.days_before}
                                onChange={(e) =>
                                    update(
                                        item.id,
                                        "days_before",
                                        Number(e.target.value)
                                    )
                                }
                                placeholder="e.g. 30"
                            />
                        </div>

                        {/* REFUND % */}
                        <div className="space-y-2">
                            <Label>Refund Percentage</Label>
                            <Slider
                                value={[
                                    typeof item.refund_percentage === "number"
                                        ? item.refund_percentage
                                        : 0,
                                ]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={(val) =>
                                    update(
                                        item.id,
                                        "refund_percentage",
                                        val?.[0] ?? 0
                                    )
                                }
                            />
                            <div className="text-sm text-muted-foreground">
                                {item.refund_percentage}% refund
                            </div>
                        </div>

                    </div>
                </Card>
            ))}
        </div>
    );
}