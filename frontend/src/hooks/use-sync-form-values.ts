import { useEffect } from "react";

export function useSyncFormValues<T extends object>(
  source: T | null | undefined,
  setFormValues: (values: T) => void
) {
  useEffect(() => {
    if (source) {
      const normalized = Object.fromEntries(
        Object.entries(source).map(([key, val]) => [key, val ?? ""])
      ) as T;

      setFormValues(normalized);
    }
  }, [source, setFormValues]);
}
