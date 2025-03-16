import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User , LogOut, UserCheck} from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile , logout} = useAuthStore();
  const {setSelectedUser} = useChatStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleLogout = () =>{
    logout();
    setSelectedUser(null);
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    //reading the file and converting into the base url
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64FormatImageUrl = reader.result;
      setSelectedImage(base64FormatImageUrl);
      await updateProfile({ profilePic: base64FormatImageUrl });
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-6">
          {/* heading and text */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your Profile Information</p>
          </div>
          {/* image upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  selectedImage || authUser.profilePic || "/assets/profile.png"
                }
                alt="profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="image-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : " "
                }`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="tex-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to upload your photo"}
            </p>
          </div>
          {/* user information */}
          {/* full Name */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>
            {/* email */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* bottom section of information */}
          <div className="mt-6 bg-base-300 rouded-xl p-6">
            <h2 className="tex-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Account Created</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
          <button
            className="flex items-center gap-2 cursor-pointer place-self-center -mt-4"
            onClick={handleLogout}
          >
            <LogOut className="size-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
