import React from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 relative">
              <img
              className="rounded-full"
                src={selectedUser.profilePic || "/assets/profile.png"}
                alt=""
              />
            </div>
          </div>

          {/* the users informations */}
          <div className="font-medium">
            <h3>
                {selectedUser.fullName}
            </h3>
            <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button onClick={() => setSelectedUser(null)} type="button">
            <X/>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
