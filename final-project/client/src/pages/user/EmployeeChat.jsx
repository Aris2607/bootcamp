import React from "react";
import ChannelBar from "../../components/chat/ChannelBar";
import ChatArea from "../../components/chat/ChatArea";
import MemberList from "../../components/chat/MemberList";

export default function EmployeeChat() {
  return (
    <div className="flex w-full md:w-full h-[100%] md:h-screen">
      {/* Channel bar */}
      <ChannelBar />

      {/* Main chat area */}
      <div className="flex flex-1">
        <ChatArea />

        {/* Member list */}
        <MemberList />
      </div>
    </div>
  );
}
