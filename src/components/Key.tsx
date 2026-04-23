import { motion } from "framer-motion";
import { useDeviceStore } from "../store/deviceStore";

type Props = {
  label: string;
  index: number;
};

function formatLabel(label: string) {
  return label.replace("KC_", "");
}

function Key({ label, index }: Props) {
  const { selectedKey, setSelectedKey } = useDeviceStore();
  const isSelected = selectedKey === index;

  return (
    <motion.div
      onClick={() => setSelectedKey(index)}
      initial={{ scale: 1 }}
      animate={{
        scale: isSelected ? 1.1 : 1,
        backgroundColor: isSelected ? "#3b82f6" : "#374151",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-16 h-16 rounded-xl flex items-center justify-center text-sm font-medium cursor-pointer"
    >
      {formatLabel(label)}
    </motion.div>
  );
}

export default Key;