import { useEffect, useRef, useCallback } from "react";
import { getJobResult } from "../api";
import { useApp } from "../context/AppContext";

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 120; // 5 minutes max

/**
 * usePolling(job_id)
 * Automatically starts polling GET /api/results/:job_id every 2.5s.
 * Updates context activeJob on every tick.
 * Stops when status is "completed" or "failed".
 * Call stopPolling() to cancel manually.
 */
export function usePolling(job_id) {
  const { setActiveJob, setUploadState, setUploadError } = useApp();
  const intervalRef = useRef(null);
  const countRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    countRef.current = 0;
  }, []);

  useEffect(() => {
    if (!job_id) return;
    countRef.current = 0;
    setUploadState("polling");

    const poll = async () => {
      countRef.current += 1;
      if (countRef.current > MAX_POLLS) {
        stopPolling();
        setUploadError("Analysis timed out. Please try again.");
        return;
      }

      try {
        const data = await getJobResult(job_id);
        setActiveJob(data);

        if (data.status === "completed") {
          stopPolling();
          setUploadState("done");
        } else if (data.status === "failed") {
          stopPolling();
          setUploadError(data.error || "Job failed on the backend.");
        }
        // status === "processing" or "analyzing" → keep polling
      } catch (err) {
        stopPolling();
        setUploadError("Could not reach backend: " + err.message);
      }
    };

    // Fire immediately then on interval
    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => stopPolling();
  }, [job_id]); // eslint-disable-line react-hooks/exhaustive-deps

  return { stopPolling };
}
