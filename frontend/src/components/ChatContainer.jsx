import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatSkeleton from "./skeletons/ChatSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessagesTime } from "../lib/formattime";

const ChatContainer = () => {
  const { messages, isMessageLoading, getMessages, selectedUser , listenToMessages , unlistenToMessage} = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessages(selectedUser._id);

    listenToMessages();

    return () => unlistenToMessage();
  }, [selectedUser._id, getMessages , listenToMessages , unlistenToMessage]);

  //for scrolling through the end when scrolled through
  const messageEndRef = useRef();

  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behaviour: "smooth"})
    }
  }, [messages])

  if (isMessageLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <ChatSkeleton />
        <ChatInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {/* message content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10">
                <img
                    className="rounded-full "
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/assets/profile.png"
                      : selectedUser.profilePic || "/assets/profile.png"
                  }
                  alt="Profile Pic"
                />
              </div>
            </div>
            {/* time stamps */}
            <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">{formatMessagesTime(message.createdAt)}</time>
            </div>
            {/* chat bubble */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2"/>
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
