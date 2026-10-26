"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { MODELS } from "@/lib/constants";

const initialSettings = {
  count: 4,
  ratio: "1:1",
  duration: 5,
  model: MODELS[0],
  style: "None",
  advanced: { seed: "", guidance: 7, negativePrompt: "" },
};

const initialState = {
  mode: "image",
  prompt: "",
  settings: initialSettings,
  generations: [],
  pending: null,
  error: null,
};

function generationReducer(state, action) {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode };

    case "SET_PROMPT":
      return { ...state, prompt: action.prompt };

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.settings } };

    case "GENERATE_START":
      // Ignored while a request is in flight, so a double submit can never create two groups.
      if (state.pending) return state;
      return { ...state, pending: action.pending, error: null };

    case "GENERATE_SUCCESS":
      return { ...state, generations: [action.generation, ...state.generations], pending: null, error: null };

    case "GENERATE_ERROR":
      return { ...state, pending: null, error: action.error };

    case "REUSE_PROMPT": {
      const { generation } = action;
      return {
        ...state,
        mode: generation.mode,
        prompt: generation.prompt,
        settings: {
          ...state.settings,
          ratio: generation.ratio,
          model: generation.model,
          style: generation.style,
          count: generation.items.length,
        },
      };
    }

    case "DELETE_GENERATION":
      return { ...state, generations: state.generations.filter((g) => g.id !== action.id) };

    case "TOGGLE_FAVORITE":
      return {
        ...state,
        generations: state.generations.map((g) =>
          g.id !== action.generationId
            ? g
            : { ...g, items: g.items.map((m) => (m.id === action.itemId ? { ...m, favorite: !m.favorite } : m)) }
        ),
      };

    default:
      return state;
  }
}

// Three contexts so consumers only re-render for what they read:
// typing in the prompt changes ComposerContext only, so the feed and history strip stay put.
const ComposerContext = createContext(null);
const FeedContext = createContext(null);
const DispatchContext = createContext(null);

export function GenerationProvider({ initialGenerations = [], children }) {
  const [state, dispatch] = useReducer(generationReducer, { ...initialState, generations: initialGenerations });

  const { mode, prompt, settings, generations, pending, error } = state;
  const composer = useMemo(() => ({ mode, prompt, settings }), [mode, prompt, settings]);
  const feed = useMemo(() => ({ generations, pending, error }), [generations, pending, error]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <ComposerContext.Provider value={composer}>
        <FeedContext.Provider value={feed}>{children}</FeedContext.Provider>
      </ComposerContext.Provider>
    </DispatchContext.Provider>
  );
}

function useRequired(context, name) {
  const value = useContext(context);
  if (!value) throw new Error(`${name} must be used within GenerationProvider`);
  return value;
}

export const useComposer = () => useRequired(ComposerContext, "useComposer");
export const useFeed = () => useRequired(FeedContext, "useFeed");
export const useGenerationDispatch = () => useRequired(DispatchContext, "useGenerationDispatch");
