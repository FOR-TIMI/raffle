import Cookies from "js-cookie";

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: true, // Only transmit over HTTPS
  sameSite: "strict" as const, // Protect against CSRF
};

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
  Cookies.set("accessToken", accessToken, COOKIE_OPTIONS);
  Cookies.set("refreshToken", refreshToken, COOKIE_OPTIONS);
};

export const getAuthCookies = () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  return { accessToken, refreshToken };
};

export const removeAuthCookies = () => {
  Cookies.remove("accessToken", { ...COOKIE_OPTIONS, expires: undefined });
  Cookies.remove("refreshToken", { ...COOKIE_OPTIONS, expires: undefined });
};
