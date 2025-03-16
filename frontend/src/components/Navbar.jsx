import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquareMore, Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-300 flex items-center">
      <div className="mx-auto container px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-base-100  flex items-center justify-center">
                <MessageSquareMore className="size-5 text-accent" />
              </div>
              <h1 className="text-lg font-bold">ChatUp</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {authUser && (
              <>
                <Link to={"/profile"} className="flex items-center gap-2">
                  <img
                    className="h-8 w-8 rounded-full boder"
                    src={authUser.profilePic || "/assets/profile.png"}
                    alt=""
                  />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
