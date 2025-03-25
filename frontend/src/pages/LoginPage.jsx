import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import {
  MessageSquareMore,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";

const LoginPage = () => {
  //show or hide password in the password field
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const [isLogingIn, setIsLogingIn] = useState(false);

  //destructuring from the useAuthStore
  const { saveUserToStore } = useAuthStore();

  const handleSubmit = async (e) => {
    setIsLogingIn(true);
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      saveUserToStore(res.data);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLogingIn(false);
  };
  return (
    <div className="h-screen px-4 sm:px-0 pt-24 sm:pt-32 lg:pt-44">
      {/* main container for the signup content */}
      <div className="flex flex-col items-center justify-center border max-w-md gap-6 rounded-lg mx-auto p-4 sm:p-8 py-8">
        {/* container for the logo image and related texts there */}
        <div className=" w-full flex flex-col items-center justify-center gap-1">
          {/* logo , welcome text and the desc text here */}
          <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <MessageSquareMore className="size-6 sm:size-10 text-accent" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold">Welcome Back!!</h1>
          <p className="text-xs sm:text-base text-base-content/80">
            Sign in to Get started with you conversations.
          </p>
        </div>
        {/* form for input fields and submit button */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3.5 sm:gap-6 w-full mt-4"
        >
          <div className="form-control flex flex-col gap-0.5">
            <label className="hidden sm:flex label font-medium ml-1 text-white">
              <span className="label-text">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="text"
                placeholder="email@email.com"
                value={formData.email}
                className="input focus:border-none focus:outline-1 w-full pl-12 bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-control flex flex-col gap-0.5">
            <label className="hidden sm:flex label font-medium ml-1 text-white">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Type your password here"
                value={formData.password}
                className="input focus:border-none focus:outline-1 w-full pl-12 bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="size-5 text-base-content/40 cursor-pointer" />
                ) : (
                  <EyeOff className="size-5 text-base-content/40 cursor-pointer" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLogingIn}
          >
            {isLogingIn ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        {/* text for navigating to login */}
        <div>
          <p className="text-sm sm:text-base text-base-content/60">
            Don't have an account?{" "}
            <Link to="/signup" className="link link-primary">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
