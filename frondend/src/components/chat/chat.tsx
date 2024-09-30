import {
  BaseEventOrig,
  Form,
  FormProps,
  Input,
  InputProps,
  View,
} from "@tarojs/components";
import "./chat.less";
import { useState } from "react";

interface ChatProps {
  data: Array<string>;
  onSend: (content: string) => void;
  disabled?: boolean;
}
export default function Chat({ data, disabled, onSend }: ChatProps) {
  return (
    <View className="flex flex-col gap-rem-1 h-full w-full chat-content">
      <ChatList data={data} />
      <UserInput disabled={disabled} onSend={onSend} />
    </View>
  );
}

interface UseInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}
function UserInput({ disabled, onSend }: UseInputProps) {
  const [inputValue, setInputValue] = useState("");
  const onInput = (event: BaseEventOrig<InputProps.inputEventDetail>) => {
    setInputValue(event.detail.value);
  };
  const onSubmit = (event: BaseEventOrig<FormProps.onSubmitEventDetail>) => {
    event.preventDefault();
    if (disabled || !inputValue) return;
    onSend(inputValue);
    setInputValue("");
  };
  return (
    <Form onSubmit={onSubmit}>
      <View className="chat-input">
        <Input
          placeholder="Please enter"
          onInput={onInput}
          value={inputValue}
          disabled={disabled}
        />
      </View>
    </Form>
  );
}

interface ChatListProps {
  data: Array<string>;
}
function ChatList({ data }: ChatListProps) {
  return (
    <View className="chat-list-wapper flex-1">
      <View className="flex h-full flex-col gap-rem-1 chat-list">
        {data.map((item, index) => (
          <ChatItem key={index} content={item} />
        ))}
      </View>
    </View>
  );
}

interface ChatItemProps {
  content: string;
}
function ChatItem({ content }: ChatItemProps) {
  return <View className="chat-item">{content}</View>;
}
