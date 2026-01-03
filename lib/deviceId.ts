import { nanoid } from "nanoid";

const DEVICE_ID_STORAGE_KEY = "device_id";
let cachedDeviceId: string | null = null;

const generateId = () => nanoid(24);

export const getDeviceId = (): string => {
  if (cachedDeviceId) return cachedDeviceId;
  if (typeof window === "undefined") return "default";

  const stored = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (stored) {
    cachedDeviceId = stored;
    return stored;
  }

  const newId = generateId();
  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, newId);
  cachedDeviceId = newId;
  return newId;
};
