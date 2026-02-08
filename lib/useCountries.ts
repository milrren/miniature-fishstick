"use client";

import { useEffect, useState } from "react";

export function useCountries() {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/countries")
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        setLoading(false);
      });
  }, []);

  return { countries, loading };
}
