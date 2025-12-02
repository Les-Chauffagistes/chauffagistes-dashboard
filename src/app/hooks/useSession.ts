import useSWR from "swr"
import { useRef } from "react";
import { usersModel } from "../../../generated/prisma/models";

export function useSession() {
  const lastUser = useRef<usersModel | null>(null);
  const { data, error, isLoading } = useSWR(
    "/api/session",
    async (url) => {
      const r = await fetch(url);
      if (!r.ok) {
        const json = await r.json();
        throw { status: r.status, message: json.error ?? "Request failed" };
      }
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