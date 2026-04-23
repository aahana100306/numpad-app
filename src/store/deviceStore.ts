import { create } from "zustand";
import { mockBackend } from "../mockBackend";

type Profile = {
  name: string;
  keymaps: string[][];
};

type DeviceState = {
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  toggleConnection: () => void;

  currentLayer: number;
  layers: string[];
  setLayer: (layer: number) => void;

  keymaps: string[][];
  setKey: (index: number, value: string) => void;

  selectedKey: number | null;
  setSelectedKey: (index: number) => void;

  hasUnsavedChanges: boolean;
  saveChanges: () => void;

  profiles: Profile[];
  currentProfile: string;
  createProfile: (name: string) => void;
  loadProfile: (name: string) => void;
  deleteProfile: (name: string) => void;

  exportProfile: () => void;
  importProfile: (data: Profile) => void;
};

const STORAGE_KEY = "numpad-app-data";

/* 🔹 Load from localStorage */
const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};

/* 🔹 Save to localStorage */
const saveData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const saved = loadData();

export const useDeviceStore = create<DeviceState>((set, get) => ({
  // Device
  connected: true,
  connect: () => set({ connected: true }),
  disconnect: () => set({ connected: false }),
  toggleConnection: () =>
    set((state) => ({ connected: !state.connected })),

  // Layers
  currentLayer: 0,
  layers: mockBackend.layers,
  setLayer: (layer) => set({ currentLayer: layer }),

  // Keymaps
  keymaps:
    saved?.keymaps || [
      Array(17).fill("KC_1"),
      Array(17).fill("KC_2"),
      Array(17).fill("KC_3"),
      Array(17).fill("KC_4"),
    ],

  setKey: (index, value) =>
    set((state) => {
      const newKeymaps = [...state.keymaps];
      const layerCopy = [...newKeymaps[state.currentLayer]];
      layerCopy[index] = value;
      newKeymaps[state.currentLayer] = layerCopy;

      const newState = {
        keymaps: newKeymaps,
        hasUnsavedChanges: true,
      };

      saveData({
        ...get(),
        ...newState,
      });

      return newState;
    }),

  // Selection
  selectedKey: null,
  setSelectedKey: (index) => set({ selectedKey: index }),

  // Save state
  hasUnsavedChanges: false,
  saveChanges: () =>
    set((state) => {
      saveData(state);
      return { hasUnsavedChanges: false };
    }),

  // Profiles
  profiles:
    saved?.profiles || [
      {
        name: "Default",
        keymaps: [
          Array(17).fill("KC_1"),
          Array(17).fill("KC_2"),
          Array(17).fill("KC_3"),
          Array(17).fill("KC_4"),
        ],
      },
    ],

  currentProfile: saved?.currentProfile || "Default",

  createProfile: (name) =>
    set((state) => {
      const newProfiles = [
        ...state.profiles,
        {
          name,
          keymaps: state.keymaps,
        },
      ];

      saveData({ ...state, profiles: newProfiles });

      return { profiles: newProfiles };
    }),

  loadProfile: (name) =>
    set((state) => {
      const profile = state.profiles.find((p) => p.name === name);
      if (!profile) return state;

      const newState = {
        keymaps: profile.keymaps,
        currentProfile: name,
      };

      saveData({ ...state, ...newState });

      return newState;
    }),

  deleteProfile: (name) =>
    set((state) => {
      const newProfiles = state.profiles.filter((p) => p.name !== name);

      saveData({ ...state, profiles: newProfiles });

      return { profiles: newProfiles };
    }),

  // Export
  exportProfile: () => {
    const state = get();
    const profile = state.profiles.find(
      (p) => p.name === state.currentProfile
    );

    if (!profile) return;

    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name}.json`;
    a.click();

    URL.revokeObjectURL(url);
  },

  // Import
  importProfile: (data) =>
    set((state) => {
      const newProfiles = [...state.profiles, data];

      saveData({ ...state, profiles: newProfiles });

      return { profiles: newProfiles };
    }),
}));