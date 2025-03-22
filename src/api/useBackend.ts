import useSWR, { SWRConfiguration } from "swr";
import { mockFetch, BASE_URL } from "../mocks/mockApi";

// JWT for prototyping. In production, replace with secure token handling.
const JWT_TOKEN = "HARDCODED_JWT_TOKEN";

async function fetcherWithJWT(url: string, method = "GET", body?: any) {
  if (import.meta.env.DEV) {
    // Return mock data in development.
    return mockFetch({ url, method: method as any, body });
  }

  // Real fetch in production.
  const fullUrl = `${BASE_URL}${url}`;
  const response = await fetch(fullUrl, {
    method,
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }
  return response.json();
}

// Helper to generate SWR keys with method + body (since SWR expects a string or array key).
function createKey(url: string, method: string, body?: any) {
  return body ? [url, method, JSON.stringify(body)] : [url, method];
}

// Custom hook wrapping SWR with JWT-enabled fetcher.
export function useBackendGET<T = any>(url: string, config?: SWRConfiguration) {
  return useSWR<T>(createKey(url, "GET"), ([path]) => fetcherWithJWT(path), config);
}

export function useBackendPOST<T = any>(url: string, body: any, config?: SWRConfiguration) {
  return useSWR<T>(
    createKey(url, "POST", body),
    ([path, , requestBody]) => fetcherWithJWT(path, "POST", JSON.parse(requestBody)),
    config
  );
}
