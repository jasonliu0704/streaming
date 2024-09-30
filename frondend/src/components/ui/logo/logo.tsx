import { Image, View } from "@tarojs/components";
// import IconLogo from "src/assets/svg/face-detection.svg";
import IconLogo from "src/assets/photo_celeb.webp";

export default function Logo() {
  return (
    <View className="w-rem-8 h-rem-8">
      <Image svg src={IconLogo} style={{ width: "100%", height: "100%" }} />
    </View>
  );
}
