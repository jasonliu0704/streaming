import { Button, View } from "@tarojs/components";
import Page from "src/components/page/page";
import UploadImage from "src/components/ui/upload-image/upload-image";
import { chooseMedia } from "src/utils/shoose-media";

import { useState } from "react";
import { showToast, navigateTo } from "@tarojs/taro";
import { updateSelectData } from "src/store/config";
export default function Index() {
  const [imageSrc, setImageSrc] = useState("");
  const onUpload = () => {
    chooseMedia({
      mediaType: ["image"],
      count: 1,
      alertText: "Upload Target face",
      cancelText: "Cancel",
      cameraText: "Camera",
      albumText: "Photo Album",
    })
      .then((res) => {
        const file = res.tempFiles[0];
        if (!file) return;
        const maxSize = 1024 * 1024 * 10;
        if (file.size > maxSize) {
          showToast({
            title: "The image size must be less than 10MB",
            icon: "error",
          });
          return;
        }
        setImageSrc(file.tempFilePath);
        updateSelectData(file.tempFilePath);
      })
      .catch(() => {});
  };

  const onNext = () => {
    if (!imageSrc) {
      showToast({ title: "Please upload the image", icon: "error" });
      return;
    }
    navigateTo({ url: "/pages/video/index" });
  };
  return (
    <Page>
      <View className="w-full h-full flex flex-col gap-rem-1 items-center">
        <UploadImage title="Upload Face" onClick={onUpload} src={imageSrc} />
        <Button className="mt-auto" type={"primary"} onClick={onNext}>
          Next
        </Button>
      </View>
    </Page>
  );
}
