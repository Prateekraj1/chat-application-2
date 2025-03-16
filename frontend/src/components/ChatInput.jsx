import { Image, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const ChatInput = () => {
  const imgInputRef = useRef();

  const [textMessage, setTextMessage] = useState("");
  const [imgMessagePreview, setImgMessagePreview] = useState(null);

  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.console.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImgMessagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImgMessagePreview(null);
    if (imgInputRef.current) {
      imgInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!textMessage.trim() && !imgMessagePreview) {
      return;
    }

    try {
      await sendMessage({
        text: textMessage.trim(),
        image: imgMessagePreview,
      });
      // clearing the input after sending
      setTextMessage("");
      setImgMessagePreview(null);
      if (imgInputRef.current) {
        imgInputRef.current.value = "";
      }
    } catch (error) {
      console.log("failed to send the message " , error)
      toast.error("Failed to send the message")
    }
  };

  return (
    <div className="p-4 w-full">
      {imgMessagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imgMessagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rouded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* input box */}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-smsm:input-md focus:border-none"
            placeholder="Type your message..."
            value={textMessage}
            onChange={(e) => {
              setTextMessage(e.target.value);
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imgInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imgMessagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => imgInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* send button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!textMessage.trim() && !imgMessagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
