import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarUrl(url: string | null) {
  return url ? `${process.env.REACT_APP_API_URL}${url}` : "/default_avatar.jpg";
}
