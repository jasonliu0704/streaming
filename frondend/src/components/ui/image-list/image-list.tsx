import { View, Image } from "@tarojs/components";
import "./image-list.less";
import { ImageData } from "src/store/config";

interface ImageItemProps extends ImageData {
  selected?: boolean;
  onClick: () => void;
}

interface ImageListProps {
  data: Array<ImageData>;
  selectedIndex?: number;
  onChooseImage: (index) => void;
}

export default function ImageList({
  data,
  selectedIndex,
  onChooseImage,
}: ImageListProps) {
  return (
    <View className="w-full h-full">
      <View className="image-list-view">
        {data.map((item, index) => (
          <ImageItem
            key={index}
            src={item.src}
            name={item.name}
            selected={selectedIndex === index}
            onClick={() => onChooseImage(index)}
          />
        ))}
      </View>
    </View>
  );
}

function ImageItem({ src, selected, onClick }: ImageItemProps) {
  return (
    <View
      className={`item-view border-box border-r-sm bg-white ${
        selected ? "image-item-selected" : ""
      }`}
    >
      <View className={`w-full h-full loading-scraper`} onClick={onClick}>
        <Image className="border-r-sm w-full h-full" src={src} />
      </View>
    </View>
  );
}
