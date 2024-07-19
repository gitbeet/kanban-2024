import { FormEvent, useEffect, useRef, useState } from "react";

function useClickOutside<T extends HTMLElement>(
  handler: (e?: FormEvent) => Promise<void>,
) {
  const ref = useRef<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      setLoading(true);
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler().catch((e) => setError(e as string));
      }
      setLoading(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handler]);

  return { ref, error, loading };
}

export default useClickOutside;
