import { View, Image, Text } from "@tarojs/components";
import IconUpload from "src/assets/svg/upload.svg";
import "./upload-image.less";
interface UploadImageProps {
  src?: string;
  title?: string;
  onClick?: () => void;
}

export default function UploadImage({ src, title, onClick }: UploadImageProps) {
  return (
    <View className="w-full cursor-pointer upload-image" onClick={onClick}>
      <View className="w-full h-full flex justify-center items-center p-x-2 text-base bg-white border-dotted-2">
        {src ? (
          <Image
            src={src}
            className="h-full flex justify-center items-center"
            mode="aspectFit"
            style={{ width: "auto" }}
          />
        ) : (
          <View className="text-base flex flex-col justify-center items-center gap-4">
            <Image className="h-rem-3 w-rem-3" svg src={IconUpload} />
            <Text>{title ? title : "Upload image"}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
