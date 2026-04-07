import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

/* ---------- CONFIG ---------- */
const KEY_LENGTH = 32;
const ROTATE_MS = 60 * 60 * 1000; // 1 hour
const MAX_OLD_KEYS = 2;

/* ---------- STATE ---------- */
interface KeyStore {
  current: string | undefined;
  previous: string[];
}

const keyStore: KeyStore = {
  current: process.env.PRIVATE_API_KEY || "default_secret_key_for_dev",
  previous: []
};

const deviceStore = new Map<string, Set<string>>(); // key → Set(deviceIds)

/* ---------- GENERATE KEY ---------- */
function generateKey() {
  return crypto.randomBytes(KEY_LENGTH).toString("hex");
}

/* ---------- ROTATE KEYS ---------- */
export function rotateKeys() {
  const newKey = generateKey();

  if (keyStore.current) {
    keyStore.previous.unshift(keyStore.current);
  }

  keyStore.previous = keyStore.previous.slice(0, MAX_OLD_KEYS);
  keyStore.current = newKey;

  console.log("🔑 Rotated Key:", newKey);
}

/* ---------- VALIDATE KEY ---------- */
function isValidKey(key: string) {
  return key === keyStore.current || keyStore.previous.includes(key);
}

/* ---------- DEVICE BIND ---------- */
function bindDevice(key: string, deviceId: string) {
  if (!deviceStore.has(key)) {
    deviceStore.set(key, new Set());
  }

  const devices = deviceStore.get(key)!;

  if (devices.size >= 3 && !devices.has(deviceId)) {
    return false;
  }

  devices.add(deviceId);
  return true;
}

/* ---------- SIGNATURE VERIFY ---------- */
function verifySignature(req: Request) {
  const signature = req.headers["x-signature"] as string;
  const timestamp = req.headers["x-timestamp"] as string;
  const body = JSON.stringify(req.body || {});

  if (!signature || !timestamp) return false;

  // Replay protection: 30-second window
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Math.abs(Date.now() - ts) > 30000) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", keyStore.current!)
    .update(body + timestamp) // Include timestamp in signature for better security
    .digest("hex");

  return signature === expected;
}

/* ---------- MASTER MIDDLEWARE ---------- */
export function secureAccess(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-api-key"] as string;
  const deviceId = req.headers["x-device-id"] as string;

  if (!key || !deviceId) {
    return res.status(403).json({ error: "missing_credentials" });
  }

  if (!isValidKey(key)) {
    return res.status(403).json({ error: "invalid_key" });
  }

  if (!bindDevice(key, deviceId)) {
    return res.status(403).json({ error: "device_limit_or_mismatch" });
  }

  if (!verifySignature(req)) {
    return res.status(403).json({ error: "invalid_signature_or_expired" });
  }

  next();
}

/* ---------- AUTO ROTATION LOOP ---------- */
setInterval(rotateKeys, ROTATE_MS);

export { keyStore };
