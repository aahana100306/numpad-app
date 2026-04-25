import { useDeviceStore } from "../store/deviceStore";

type Props = {
  label: string;
  index: number;
};

function formatLabel(label: string | undefined) {
  if (!label) return "?";
  return label.replace("KC_", "");
}

function Key({ label, index }: Props) {
  const { selectedKey, setSelectedKey } = useDeviceStore();
  const isSelected = selectedKey === index;

  return (
    <div
      onClick={() => setSelectedKey(index)}
      className={`
        flex items-center justify-center
        rounded-xl cursor-pointer
        transition-all duration-200
        text-sm font-medium

        ${isSelected ? "bg-blue-500 scale-105" : "bg-gray-700 hover:bg-gray-600"}
        
        w-16 h-16
      `}
    >
      {formatLabel(label)}
    </div>
  );
}

export default Key;