import { Button, Text, View } from "@tarojs/components";
import { CSSProperties } from "react";
import "./guide.less";

interface GuideProps {
  open: boolean;
  title: string;
  description: string;
  position: "top" | "bottom";
  children: React.ReactNode;
  className?: string;
  wapperClassName?: string;
  offsetX?: number | string;
  offsetY?: number | string;
  onClose: () => void;
}

export default function Guide({
  open,
  title,
  description,
  position,
  children,
  className,
  wapperClassName,
  offsetY,
  onClose,
}: GuideProps) {
  const zIndex = 1000;
  const wapperStyle: CSSProperties = {};
  const containerStyle: CSSProperties = {};
  const guideStyle: CSSProperties = {};
  if (open) {
    wapperStyle.zIndex = zIndex;
    containerStyle.zIndex = zIndex + 1;
    guideStyle.zIndex = zIndex + 2;
    if (position === "top") {
      guideStyle.top = 0;
      guideStyle.transform = "translateY(-100%)";
      if (offsetY) {
        guideStyle.top = offsetY;
      }
    } else {
      guideStyle.bottom = 0;
      guideStyle.transform = "translateY(100%)";
      if (offsetY) {
        guideStyle.bottom = offsetY;
      }
    }
  }
  return (
    <>
      <View className={`relative ${wapperClassName}`} style={containerStyle}>
        <View className={className}>{children}</View>
        {open && (
          <View
            className="absolute border-box bg-white w-full border-r-sm guide-conent"
            style={guideStyle}
          >
            <View className="flex justify-between items-center">
              <Text className="guide-title">{title}</Text>
              <View className="cursor-pointer" onClick={onClose}>
                ✕
              </View>
            </View>
            <View className="flex items-center">
              <Text className="guide-des">{description}</Text>
              <Button
                style={{ margin: 0, marginLeft: "auto" }}
                type="primary"
                onClick={onClose}
                size="mini"
              >
                Next
              </Button>
            </View>
            <View
              className={
                position === "bottom" ? "guide-arrow-up" : "guide-arrow-down"
              }
            />
          </View>
        )}
      </View>
      {open && <View style={wapperStyle} className={`guide-mask`}></View>}
    </>
  );
}
