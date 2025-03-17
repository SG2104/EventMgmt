import { VITE_API_URL } from "@/config/envVariables";
import { useState, useCallback } from "react";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  fetchData: (body?: unknown) => Promise<T | void>;
}

function useFetch<T>(url: string, options: FetchOptions): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const baseUrl = VITE_API_URL;

  const fetchData = useCallback(
    async (body?: unknown): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}${url}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
          body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = (await response.json()) as T;
        setData(responseData);
        return responseData; // Directly return fetched data
      } catch (err) {
        setError((err as Error).message);
        throw err; // Propagate the error
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  return { data, error, loading, fetchData };
}

export const usePost = <T>(url: string) => {
  const options: FetchOptions = { method: "POST" };
  return useFetch<T>(url, options);
};

export const usePatch = <T>(url: string) => {
  const options: FetchOptions = { method: "PATCH" };
  return useFetch<T>(url, options);
};

export const useDelete = <T>(url: string) => {
  const options: FetchOptions = { method: "DELETE" };
  return useFetch<T>(url, options);
};

export const useGet = <T>(url: string) => {
  const options: FetchOptions = { method: "GET" };
  return useFetch<T>(url, options);
};
