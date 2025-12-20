import { apiUrl } from "./api";
import { deleteSessionCookie, getSessionCookie } from "@/util/authCookies";

type ApiError = {
  status: number;
  message: string;
  payload?: any;
};

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/bonhomiee/login") {
    window.location.href = "/bonhomiee/login";
  }
};


const extractErrorMessage = (body: any): string => {
  if (!body) return "API request failed";

  if (typeof body === "string") return body;

  return (
    body.message ||
    body.error ||
    body.detail ||
    body.errors ||
    "API request failed"
  );
};

export const apiFetch = async <T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { skipAuth = false, headers, ...rest } = options;

  const token = getSessionCookie("auth_token");

  const authHeader =
    !skipAuth && token
      ? {
          Authorization: `Basic ${btoa(`${token}:`)}`,
        }
      : {};

  let res: Response;

  try {
    res = await fetch(apiUrl(path), {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...(headers || {}),
      },
    });
  } catch {
    throw {
      status: 0,
      message: "Network error. Please check your connection.",
    } as ApiError;
  }

  const rawText = await res.text();

  let parsedBody: any = null;
  try {
    parsedBody = rawText ? JSON.parse(rawText) : null;
  } catch {
    parsedBody = rawText;
  }

  console.groupCollapsed(
    `%cAPI ${res.ok ? "SUCCESS" : "ERROR"} → ${path}`,
    `color: ${res.ok ? "green" : "red"}`
  );
  console.log("Status:", res.status);
  console.log("Response body:", parsedBody);
  console.groupEnd();

  if (res.status === 401) {
    console.warn("Unauthorized (401). Redirecting to /login");

    deleteSessionCookie("auth_token");

    redirectToLogin();

    throw {
      status: 401,
      message: "Session expired. Please login again.",
      payload: parsedBody,
    } as ApiError;
  }

  if (!res.ok) {
    const message = extractErrorMessage(parsedBody);

    console.error("API ERROR MESSAGE:", message);

    throw {
      status: res.status,
      message,
      payload: parsedBody,
    } as ApiError;
  }

  return parsedBody as T;
};
