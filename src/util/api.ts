const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

export const apiUrl = (path: string) => {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
