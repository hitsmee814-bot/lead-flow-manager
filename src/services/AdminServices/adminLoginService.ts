import { apiFetch } from "@/util/apiClient";

export const adminLoginService = {
    login: (username: string, password: string) => {
        return apiFetch("/admin/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });
    },
};