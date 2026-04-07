import CryptoJS from "crypto-js";

/**
 * Signs a request body with an API key and timestamp.
 * @param body The request body object.
 * @param apiKey The current Ghostchain API key.
 * @returns An object containing the headers for the secure request.
 */
export function signRequest(body: any, apiKey: string) {
  const timestamp = Date.now().toString();
  const bodyStr = JSON.stringify(body || {});
  
  // The signature includes the body and timestamp to prevent replay attacks
  const signature = CryptoJS.HmacSHA256(
    bodyStr + timestamp,
    apiKey
  ).toString();

  return {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "x-device-id": getDeviceId(),
    "x-signature": signature,
    "x-timestamp": timestamp
  };
}

/**
 * Generates or retrieves a unique device ID for the current browser session.
 */
function getDeviceId() {
  let deviceId = localStorage.getItem("ghostchain_device_id");
  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("ghostchain_device_id", deviceId);
  }
  return deviceId;
}

/**
 * Fetches the current Ghostchain key from the server (FOR DEMO PURPOSES).
 * In a real app, this would be handled via a secure handshake or initial auth.
 */
export async function fetchGhostchainKey() {
  try {
    const response = await fetch("/api/ghostchain/key");
    const data = await response.json();
    return data.currentKey;
  } catch (error) {
    console.error("Failed to fetch Ghostchain key:", error);
    return null;
  }
}
