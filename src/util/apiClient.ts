import { apiUrl } from "./api";

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

export const apiFetch = async <T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> => {
  const res = await fetch(apiUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  return res.json();
};
