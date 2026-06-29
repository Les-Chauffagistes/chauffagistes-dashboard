import useSWR from "swr"
import { useRef } from "react";

export type SessionUser = { id: string, pseudo: string, address: string | null }

export function useSession() {
  const lastUser = useRef<SessionUser | null>(null);
  const { data, error, isLoading } = useSWR<SessionUser | null>(
    "/api/user",
    async (url) => {
      const r = await fetch(url);
      if (!r.ok) return null;
      return r.json();
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 3_600_000,
      shouldRetryOnError: false,
    }
  );

  if (data) lastUser.current = data;

  return {
    user: lastUser.current,
    isLoading,
    isError: !!error,
    error,
  };
}
