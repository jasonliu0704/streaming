import { View } from "@tarojs/components";
import "./mask.less";

interface MaskProps {
  children?: React.ReactNode;
  onClose?: () => void;
  hide?: boolean;
}
export default function Mask({ children, hide, onClose }: MaskProps) {
  return (
    <>
      <View
        className="mask-wapper"
        style={{ visibility: hide ? "hidden" : "visible" }}
      >
        <View className="mask" onClick={onClose}></View>
        {children && (
          <View
            className={`content-wapper ${hide ? "content-wapper-hide" : ""}`}
          >
            {children}
          </View>
        )}
      </View>
    </>
  );
}
