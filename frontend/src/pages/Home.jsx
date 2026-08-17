import React from "react";
import { FcGoogle } from "react-icons/fc";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./../../utils/firebase";
import api from "./../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import SideBar from './../components/SideBar.jsx';
import ChatArea from './../components/ChatArea.jsx';
import Artifact from "./../components/Artifact.jsx";

function Home() {
const {userData} = useSelector((state) => state.user);
const dispatch = useDispatch();
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token: token });
      
      dispatch(setUserData(data));
    } catch (error) {
      console.log("Error during login:", error);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    console.log(data);
    const token = await data.user.getIdToken();
    console.log(`Token: ${token}`);
    await handleLogin(token);
    
  };
  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">

<SideBar/>
<ChatArea/>
<Artifact/>

{!userData && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60      backdrop-blur">
        <div className="w-[340px] bg-[#13151c] border border-white/0.08 rounded-2xl p-7 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
              Welcome to MindHive
            </h2>
            <p className="text-[13px] text-slate-500">
              Please login to continue using the app
            </p>
          </div>
           <button
            className="
              group relative w-full h-12 overflow-hidden rounded-lg
              bg-[#13151c] border border-white/10
              flex items-center justify-center gap-3
              transition-all duration-300
              hover:border-white/20
              hover:bg-[#181b24]
              hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]
              hover:-translate-y-0.5
              active:translate-y-0
              before:absolute before:inset-0
              before:-translate-x-full
              before:bg-gradient-to-r
              before:from-transparent
              before:via-white/10
              before:to-transparent
              before:transition-transform
              before:duration-700
              hover:before:translate-x-full
            "
            onClick={googleLogin}
          >
            <FcGoogle />
            <span className="text-[15px] font-medium text-slate-400">
              Continue with Google
            </span>
          </button>
        </div>
      </div> }

    </div>
  );
}

export default Home;
