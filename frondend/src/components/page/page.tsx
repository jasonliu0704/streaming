import { View } from "@tarojs/components";
import { ReactNode, useState } from "react";
import { isPC } from "src/utils/common";
import "./page.less";

interface PageProps {
  children: ReactNode;
}
export default function Page({ children }: PageProps) {
  const [isPc] = useState(isPC());
  const wapperClass = isPc ? "hull w-full pc-max-width" : "h-full w-full";
  return (
    <View className="<%= pageName %> common-bg h-full w-full flex justify-center border-box p-rem-1 absolute">
      <View className={wapperClass}>{children}</View>
    </View>
  );
}
