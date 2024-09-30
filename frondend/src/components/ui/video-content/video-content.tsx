import { Image, View, Video } from "@tarojs/components";
import IconLoading from "src/assets/svg/spinning-circles.svg";
import "./video-content.less";
interface VideoContentProps {
  src?: string;
}
export default function VideoContent({ src }: VideoContentProps) {
  return (
    <View className="video-content">
      <View className="w-full h-full flex justify-center items-center p-x-2 text-base relative">
        {src ? (
          <Video src={src} className="w-full h-full" autoplay />
        ) : (
          <Image
            src={IconLoading}
            svg={true}
            // className="w-full"
            mode="scaleToFill"
            // style={{ height: "50%" }}
          />
        )}
      </View>
    </View>
  );
}
