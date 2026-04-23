import { useDeviceStore } from "./store/deviceStore";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { keyOptions } from "./data/keyOptions";
import { useState } from "react";
import { motion } from "framer-motion";

import Keymap from "./screens/Keymap";
import Encoder from "./screens/Encoder";
import OLED from "./screens/OLED";
import Macros from "./screens/Macros";
import Profiles from "./screens/Profiles";
import Firmware from "./screens/Firmware";

function App() {
  const location = useLocation();

  const {
    currentLayer,
    selectedKey,
    keymaps,
    setKey,
    setLayer,
    layers,
    hasUnsavedChanges,
    saveChanges,
    connected,
    toggleConnection,
    currentProfile,
  } = useDeviceStore();

  const keymap = keymaps[currentLayer];
  const [activeTab, setActiveTab] = useState("standard");

  const menuItems = [
    { name: "Keymap", path: "/" },
    { name: "Encoder", path: "/encoder" },
    { name: "OLED", path: "/oled" },
    { name: "Macros", path: "/macros" },
    { name: "Profiles", path: "/profiles" },
    { name: "Firmware", path: "/firmware" },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-800 p-5 flex flex-col justify-between">

        <div>
          <h1 className="text-lg font-bold mb-6">Numpad Configurator</h1>

          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.name}>
                  <Link to={item.path}>
                    <div
                      className={`
                        px-3 py-2 rounded-lg cursor-pointer
                        transition-all duration-200

                        ${isActive
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-700 text-gray-300"}
                      `}
                    >
                      {item.name}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Device status */}
        <div className="bg-gray-700 p-3 rounded-lg text-sm">
          <p className="text-green-400">● Connected</p>
          <p className="text-gray-400 mt-1">Firmware v1.0</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-700">

          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
            <span>{connected ? "Device Connected" : "Disconnected"}</span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleConnection}
              className="bg-gray-700 px-2 py-1 rounded text-sm"
            >
              {connected ? "Disconnect" : "Connect"}
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            <span>Profile: {currentProfile}</span>
            <span>Layer: {currentLayer}</span>

            <motion.button
              animate={{
                boxShadow: hasUnsavedChanges
                  ? "0px 0px 10px rgba(59,130,246,0.7)"
                  : "none",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveChanges}
              className={`px-3 py-1 rounded ${
                hasUnsavedChanges ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              Save Changes
            </motion.button>
          </div>
        </div>

        {/* LAYERS */}
        <div className="flex gap-3 px-6 py-4">
          {layers.map((layer, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLayer(i)}
              className={`px-4 py-1 rounded ${
                currentLayer === i
                  ? "bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {layer}
            </motion.button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 px-6 pb-6 flex gap-6">

          {/* LEFT PANEL */}
          <div className="flex-1 bg-gray-800 rounded-xl p-6 flex items-center justify-center">
            <Routes>
              <Route path="/" element={<Keymap />} />
              <Route path="/encoder" element={<Encoder />} />
              <Route path="/oled" element={<OLED />} />
              <Route path="/macros" element={<Macros />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/firmware" element={<Firmware />} />
            </Routes>
          </div>

          {/* CENTER PANEL (empty / preview) */}
          <div className="flex-1 bg-gray-800 rounded-xl flex items-center justify-center">
            {selectedKey === null ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400"
              >
                <div className="text-4xl mb-3">🖱️</div>
                <p className="text-lg">Select a key</p>
                <p className="text-sm mt-1">Click a key to configure</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <p className="mb-3">Selected Key</p>
                <div className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center text-lg">
                  {keymap[selectedKey].replace("KC_", "")}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-gray-800 p-5 rounded-xl"
          >
            <h2 className="text-lg mb-4">Key Settings</h2>

            {selectedKey !== null ? (
              <div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  {["standard", "media", "macro", "layer"].map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2 py-1 rounded ${
                        activeTab === tab
                          ? "bg-blue-500"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {tab}
                    </motion.button>
                  ))}
                </div>

                {/* Dropdown */}
                <select
                  className="w-full p-2 bg-gray-700 rounded"
                  value={keymap[selectedKey]}
                  onChange={(e) => setKey(selectedKey, e.target.value)}
                >
                  {keyOptions.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>

              </div>
            ) : (
              <p className="text-gray-400">Select a key</p>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default App;