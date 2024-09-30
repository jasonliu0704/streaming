import { View } from "@tarojs/components";
import { useRef, useState } from "react";
import Chat from "src/components/chat/chat";
import Page from "src/components/page/page";
import VideoContent from "src/components/ui/video-content/video-content";
import { chat } from "src/server/swap";

export default function Index() {
  const [chatData, setChatData] = useState<Array<string>>([]);
  const [disabled, setDisabled] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const onSend = (content: string) => {
    setDisabled(true);
    setChatData((prev) => [...prev, content]);
    setVideoSrc("");
    chat(content)
      .then((res) => {
        setVideoSrc("http://localhost:8000/chat");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setDisabled(false);
      });
  };
  return (
    <Page>
      <View className="w-full h-full flex flex-col gap-rem-1 items-center">
        <VideoContent src={videoSrc} />
        <Chat data={chatData} disabled={disabled} onSend={onSend} />
      </View>
    </Page>
  );
}
