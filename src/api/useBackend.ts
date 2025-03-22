import useSWR, { SWRConfiguration } from "swr";
import { mockFetch, MockMethod } from "../mocks/mockApi";

// BASE_URL configuration for API endpoints
export const BASE_URL = import.meta.env.PROD
  ? "/api" // Production API path
  : "http://localhost:8080"; // Development server

// Types for API requests and responses
export interface RequestOptions {
  url: string;
  method: MockMethod;
  body?: Record<string, unknown>;
}

// JWT for prototyping. In production, replace with secure token handling.
const JWT_TOKEN = "HARDCODED_JWT_TOKEN";

// Export the fetcherWithJWT function to be used directly by components
export async function fetcherWithJWT(url: string, method: MockMethod = "GET", body?: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    // Return mock data in development.
    return mockFetch({ url, method, body });
  }

  // Real fetch in production.
  const fullUrl = `${BASE_URL}${url}`;
  console.log(`Making API call to: ${fullUrl}`, { method, body });
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
  const data = await response.json();
  console.log(`API response from ${url}:`, data);
  return data;
}

// Helper to generate SWR keys with method + body (since SWR expects a string or array key).
function createKey(url: string, method: MockMethod, body?: Record<string, unknown>) {
  return body ? [url, method, JSON.stringify(body)] : [url, method];
}

// Custom hook wrapping SWR with JWT-enabled fetcher.
export function useBackendGET<T>(url: string, config?: SWRConfiguration) {
  return useSWR<T>(createKey(url, "GET"), ([path]) => fetcherWithJWT(path, "GET"), config);
}

export function useBackendPOST<T>(url: string, body: Record<string, unknown>, config?: SWRConfiguration) {
  return useSWR<T>(
    createKey(url, "POST", body),
    ([path, , requestBody]) => fetcherWithJWT(path, "POST", JSON.parse(requestBody)),
    config
  );
}
