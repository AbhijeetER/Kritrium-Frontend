import React, { createContext, useContext, useReducer, useCallback } from "react";

// ─── INITIAL STATE ───────────────────────────────────────────
const initialState = {
  // User
  username: "",

  // Originals list (for dropdown)
  originals: [],
  originalsLoading: false,

  // Dashboard summary + results list
  summary: { total: 0, pirated: 0, clean: 0, pending: 0 },
  results: [],
  resultsLoading: false,

  // Active job being polled {polling ho i hai}
  activeJob: null,        // { job_id, status, ... }
  activeJobLoading: false,

  // Health {}
  health: null,

  // Upload page state {dekhne ki upload hua ki nahi}
  uploadState: "idle",    // idle | uploading | polling | done | error
  uploadError: null,
};

// ─── REDUCER  ─────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload };

    case "SET_ORIGINALS":
      return { ...state, originals: action.payload, originalsLoading: false };
    case "SET_ORIGINALS_LOADING":
      return { ...state, originalsLoading: action.payload };

    case "SET_SUMMARY":
      return { ...state, summary: action.payload };
    case "SET_RESULTS":
      return { ...state, results: action.payload, resultsLoading: false };
    case "SET_RESULTS_LOADING":
      return { ...state, resultsLoading: action.payload };

    case "SET_ACTIVE_JOB":
      return { ...state, activeJob: action.payload, activeJobLoading: false };
    case "SET_ACTIVE_JOB_LOADING":
      return { ...state, activeJobLoading: action.payload };
    case "CLEAR_ACTIVE_JOB":
      return { ...state, activeJob: null, uploadState: "idle", uploadError: null };

    case "SET_HEALTH":
      return { ...state, health: action.payload };

    case "SET_UPLOAD_STATE":
      return { ...state, uploadState: action.payload };
    case "SET_UPLOAD_ERROR":
      return { ...state, uploadError: action.payload, uploadState: "error" };

    default:
      return state;
  }
}

// ─── CONTEXT ─────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUsername = useCallback((name) =>
    dispatch({ type: "SET_USERNAME", payload: name }), []);

  const setOriginals = useCallback((list) =>
    dispatch({ type: "SET_ORIGINALS", payload: list }), []);

  const setOriginalsLoading = useCallback((v) =>
    dispatch({ type: "SET_ORIGINALS_LOADING", payload: v }), []);

  const setSummaryAndResults = useCallback((summary, results) => {
    dispatch({ type: "SET_SUMMARY", payload: summary });
    dispatch({ type: "SET_RESULTS", payload: results });
  }, []);

  const setResultsLoading = useCallback((v) =>
    dispatch({ type: "SET_RESULTS_LOADING", payload: v }), []);

  const setActiveJob = useCallback((job) =>
    dispatch({ type: "SET_ACTIVE_JOB", payload: job }), []);

  const clearActiveJob = useCallback(() =>
    dispatch({ type: "CLEAR_ACTIVE_JOB" }), []);

  const setHealth = useCallback((h) =>
    dispatch({ type: "SET_HEALTH", payload: h }), []);

  const setUploadState = useCallback((s) =>
    dispatch({ type: "SET_UPLOAD_STATE", payload: s }), []);

  const setUploadError = useCallback((e) =>
    dispatch({ type: "SET_UPLOAD_ERROR", payload: e }), []);

  return (
    <AppContext.Provider value={{
      state,
      setUsername,
      setOriginals,
      setOriginalsLoading,
      setSummaryAndResults,
      setResultsLoading,
      setActiveJob,
      clearActiveJob,
      setHealth,
      setUploadState,
      setUploadError,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
