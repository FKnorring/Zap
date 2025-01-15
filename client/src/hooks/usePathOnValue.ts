import { getFirebaseServices } from "@/firebase";
import { DataSnapshot, off, onValue, ref } from "firebase/database";
import { useEffect, useRef } from "react";

export function usePathOnValue<T>(
  path?: string,
  callback?: (value: Record<string, T>) => void
) {
  const previousValueRef = useRef<Record<string, T> | null>(null);

  useEffect(() => {
    if (!path) return;
    const { database } = getFirebaseServices();
    const pathRef = ref(database, path);

    const extractValue = (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) return;
      const newValue = snapshot.val() as Record<string, T>;
      
      if (JSON.stringify(previousValueRef.current) !== JSON.stringify(newValue)) {
        previousValueRef.current = newValue;
        callback?.(newValue);
      }
    };

    onValue(pathRef, extractValue);

    return () => {
      off(pathRef, "value", extractValue);
    };
  }, [path, callback]);
}
