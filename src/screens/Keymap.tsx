import { motion } from "framer-motion";
import { useDeviceStore } from "../store/deviceStore";
import Key from "../components/Key";

function Keymap() {
  const { keymaps, currentLayer } = useDeviceStore();
  const keymap = keymaps[currentLayer];

  return (
    <div className="flex h-full items-center justify-center">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-800 p-6 rounded-2xl shadow-xl"
      >
        <div className="grid grid-cols-4 gap-4">
          {keymap.map((key, index) => (
            <Key key={index} label={key} index={index} />
          ))}
        </div>
      </motion.div>

    </div>
  );
}

export default Keymap;