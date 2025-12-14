export const setSessionCookie = (
  name: string,
  value: string,
  ttlMinutes: number
) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + ttlMinutes * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
};

export const getSessionCookie = (name: string) => {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? match[2] : null;
};

export const deleteSessionCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
