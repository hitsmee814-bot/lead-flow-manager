import { Badge } from "@/components/Badge";
import { LogOut, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import logo from "@/assets/images/logoPrimary.png"
type Props = {
    title: string;
    subtitle?: string;
    count?: number;
    onLogout?: () => void;
    rightActions?: React.ReactNode;
};

export function AppHeader({
    title,
    subtitle,
    count,
    onLogout,
    rightActions,
}: Props) {
    return (
        <header className="border-b bg-card">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-6 w-6 object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-[#00AFEF]">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4">
                        {count !== undefined && (
                            <Badge variant="secondary">{count}</Badge>
                        )}

                        {rightActions}

                        {onLogout && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to logout?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={onLogout}>
                                            Logout
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}