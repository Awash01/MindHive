import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessagesSquare,
  Mic,
  Paperclip,
  Presentation,
  Send,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import sendMessage from "../features/sendMessage.js";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts } from "../redux/messageSlice.js";
import { createConversation } from "./../features/createConversation.js";
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversationSlice.js";
import { updateConversation } from "../features/updateConversation.js";

function ChatInput() {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const { selectedConversation } = useSelector((state) => state.conversation);
  
  const dispatch = useDispatch();
  const handleSendMessage = async () => {
    let conversation = selectedConversation;
    if (!conversation) {
      const conv = await createConversation();
      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv));
      conversation = conv;
    }
    if (conversation.title == "New Chat") {
      const updated = await updateConversation({
        id: conversation?._id,
        title: value.trim(),
      });

    

      dispatch(
        setConvTitle({
          conversationId: conversation._id,
          title: value.trim(),
        }),
      );
    }
    const payload = {
      prompt: value.trim(),
      conversationId: conversation?._id,agent:selectedAgent.toLowerCase()
    };

    dispatch(addMessage({ role: "user", content: value.trim() }));
    setValue("");
    const data = await sendMessage(payload);
    dispatch(setArtifacts(data.artifacts || []))
    dispatch(addMessage({ role: "assistant", content: data?.answer, images:data?.images }));
    console.log(data);
  };
  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessagesSquare,
      label: "Chat",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
    {
      id: "image",
      icon: ImageIcon,
      label: "Image",
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
  ];

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label;
            const Icon = agent.icon;
            return (
              <div
                onClick={()=>setSelectedAgent(agent.label)}
                className={`
              flex-shrink-0
              cursor-pointer
              inline-flex
              items-center
              gap-1.5
              px-3
              py-2
              rounded-full
              text-xs
              font-medium
              border
              transition-all

              ${
                isActive
                  ? "bg-slate-900 text-white border border-slate-700/80 shadow-sm hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
                  : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
              }
              `}
              >
                <Icon
                  size={14}
                  className={isActive ? " text-white" : " text-slate-500"}
                />
                {agent.label}
              </div>
            );
          })}
        </div>
        <textarea
          placeholder="Ask Anything..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Paperclip size={16} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Mic size={16} />
            </button>
          </div>
          <button
            disabled={!value}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg
            border transition-all duration-200 ease-out
            ${
              value.trim()
                ? "bg-indigo-500/10 border-indigo-400/15 text-indigo-400 shadow-sm shadow-indigo-500/10 hover:bg-indigo-500/15 hover:border-indigo-400/25 active:scale-90"
                : "bg-white/[0.03] border-white/[0.06] text-slate-600 cursor-not-allowed"
            }`}
          >
            <Send size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
