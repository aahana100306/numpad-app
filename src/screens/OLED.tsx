import { useState } from "react";
import { useDeviceStore } from "../store/deviceStore";

function OLED() {
  const {
    oled,
    setOledLayout,
    setOledLogo,
    setOledProfileMode,
  } = useDeviceStore();

  const [tab, setTab] = useState("layout");

  return (
    <div className="w-full max-w-lg space-y-6">

      {/* Tabs */}
      <div className="flex gap-2">
        {["layout", "logo", "profile"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${
              tab === t
                ? "bg-blue-500"
                : "bg-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB 1: Layout */}
      {tab === "layout" && (
        <div className="space-y-4">

          {["A", "B", "C"].map((zone) => (
            <div key={zone}>
              <p className="text-sm text-gray-400">
                Zone {zone}
              </p>

              <select
                className="w-full p-2 bg-gray-700 rounded"
                value={oled.layout[zone as "A" | "B" | "C"]}
                onChange={(e) =>
                  setOledLayout(
                    zone as "A" | "B" | "C",
                    e.target.value
                  )
                }
              >
                <option>Layer</option>
                <option>Profile</option>
                <option>Custom</option>
                <option>Blank</option>
              </select>
            </div>
          ))}

        </div>
      )}

      {/* TAB 2: Logo */}
      {tab === "logo" && (
        <div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () =>
                setOledLogo(reader.result as string);
              reader.readAsDataURL(file);
            }}
          />

          {oled.logo && (
            <img
              src={oled.logo}
              className="mt-4 max-h-40"
            />
          )}

        </div>
      )}

      {/* TAB 3: Profile */}
      {tab === "profile" && (
        <div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={oled.perProfile}
              onChange={(e) =>
                setOledProfileMode(e.target.checked)
              }
            />
            Only active for this profile
          </label>

        </div>
      )}

    </div>
  );
}

export default OLED;