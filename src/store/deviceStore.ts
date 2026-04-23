import { create } from "zustand";
import { mockBackend } from "../mockBackend";

type Profile = {
  name: string;
  keymaps: string[][];
};

type DeviceState = {
  connected: boolean;
  currentLayer: number;
  layers: string[];

  keymaps: string[][];

  selectedKey: number | null;
  setSelectedKey: (index: number) => void;

  setKey: (index: number, value: string) => void;
  setLayer: (layer: number) => void;

  // Unsaved changes
  hasUnsavedChanges: boolean;
  setUnsavedChanges: (value: boolean) => void;
  saveChanges: () => void;

  // Profiles
  profiles: Profile[];
  currentProfile: string;

  createProfile: (name: string) => void;
  loadProfile: (name: string) => void;
  deleteProfile: (name: string) => void;

  // Export / Import
  exportProfile: () => void;
  importProfile: (data: Profile) => void;
};

export const useDeviceStore = create<DeviceState>((set, get) => ({
  connected: mockBackend.connected,
  currentLayer: 0,
  layers: mockBackend.layers,

  keymaps: [
    Array(17).fill("KC_1"),
    Array(17).fill("KC_2"),
    Array(17).fill("KC_3"),
    Array(17).fill("KC_4"),
  ],

  selectedKey: null,

  setSelectedKey: (index) => set({ selectedKey: index }),

  setKey: (index, value) =>
    set((state) => {
      const newKeymaps = [...state.keymaps];
      const layerCopy = [...newKeymaps[state.currentLayer]];
      layerCopy[index] = value;
      newKeymaps[state.currentLayer] = layerCopy;

      return {
        keymaps: newKeymaps,
        hasUnsavedChanges: true,
      };
    }),

  setLayer: (layer) => set({ currentLayer: layer }),

  // Unsaved changes
  hasUnsavedChanges: false,

  setUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),

  saveChanges: () =>
    set(() => ({
      hasUnsavedChanges: false,
    })),

  // Profiles
  profiles: [
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

  currentProfile: "Default",

  createProfile: (name) =>
    set((state) => ({
      profiles: [
        ...state.profiles,
        {
          name,
          keymaps: [
            Array(17).fill("KC_1"),
            Array(17).fill("KC_2"),
            Array(17).fill("KC_3"),
            Array(17).fill("KC_4"),
          ],
        },
      ],
    })),

  loadProfile: (name) =>
    set((state) => {
      const profile = state.profiles.find((p) => p.name === name);
      if (!profile) return state;

      return {
        keymaps: profile.keymaps,
        currentProfile: name,
      };
    }),

  deleteProfile: (name) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.name !== name),
    })),

  // Export profile
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

  // Import profile
  importProfile: (data) =>
    set((state) => ({
      profiles: [...state.profiles, data],
    })),
}));