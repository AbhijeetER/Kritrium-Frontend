import { useEffect, useRef, useCallback } from "react";
import { getResults, getOriginals, getHealth } from "../api";
import { useApp } from "../context/AppContext";

const REFRESH_MS = 8000; // refresh dashboard every 8s

export function useDashboard() {
  const {
    setOriginals, setOriginalsLoading,
    setSummaryAndResults, setResultsLoading,
    setHealth,
  } = useApp();
  const intervalRef = useRef(null);

  const fetchAll = useCallback(async () => {
    try {
      setResultsLoading(true);
      const [resultsData, originalsData, healthData] = await Promise.allSettled([
        getResults({ limit: 50 }),
        getOriginals(),
        getHealth(),
      ]);

      if (resultsData.status === "fulfilled") {
        const { summary, results } = resultsData.value;
        setSummaryAndResults(summary, results);
      }
      if (originalsData.status === "fulfilled") {
        setOriginals(originalsData.value);
      }
      if (healthData.status === "fulfilled") {
        setHealth(healthData.value);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setResultsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchAll]);

  return { refresh: fetchAll };
}
