import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Paperclip, Phone, Search, Send, Smile, Video } from "lucide-react";

import { useDarkModeContext } from "@/context/darkMode";

import { useUser } from "@/hooks/useUser";
import { Input } from "./ui/input";
import Message from "./Message";
import { useSocket } from "@/context/socket";


type Props = {
  interactingUserId: string | null;

}

export default function Messages({ interactingUserId }: Props) {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const typingIndicatorRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<string | number | NodeJS.Timeout | undefined>(undefined);
  const { darkMode } = useDarkModeContext()
  const { user } = useUser()
  const socket = useSocket();
  const [messages, setMessages] = useState<Chat[]>([])
  const [sender, setSender] = useState<User | null>(null)
  const [inputMessage, setInputMessage] = useState<string>("")

  const [isTyping, setIsTyping] = useState(false);
  const [otherUserIsTyping, setOtherUserIsTyping] = useState(false);

  function generateId() {
    // Generate a random number and convert it to base 36 (numbers + letters)
    const randomNumber = Math.random().toString(36);

    // Use current timestamp to make sure ID is unique
    const timestamp = Date.now().toString(36);

    // Concatenate random number and timestamp to create ID
    return randomNumber + timestamp;
  }

  const uuid = generateId()

  useEffect(() => {
    socket?.emit("join-room", "123");

    socket?.on('user-typing-status', (data) => {
      console.log(data.isTyping)
      setOtherUserIsTyping(data.isTyping);
    });
  }, [socket])

  const handleKeyDown = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit('user-typing', { roomId: "123", isTyping: true });
    }
    clearTimeout(typingTimeout.current);
  };

  const handleKeyUp = () => {
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('user-typing', { roomId: "123", isTyping: false });
    }, 2000); // Adjust the delay as needed
  };


  useEffect(() => {
    const fetchMessage = async () => {
      if (!interactingUserId) return
      const { data } = await axios.post("http://localhost:1337/api/v1/chat/get-user-messages", {
        senderId: user?.id,
        receiverId: interactingUserId
      }, {
        withCredentials: true
      })

      setMessages(data.message)
    }
    fetchMessage()
  }, [user?.id, interactingUserId])

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data } = await axios.post("http://localhost:1337/api/v1/user/get-user-details", {
        id: interactingUserId
      }, {
        withCredentials: true
      }
      )
      setSender(data.message)
    }
    fetchUserDetails()
  }, [interactingUserId])

  const handleClick = () => {
    socket?.emit("chat message", { message: inputMessage, userId: user?.id, interactingUserId })
  }

  useEffect(() => {
    const handleReceiveMessage = (data: Chat) => {
      console.log(data)
      setMessages((prev) => [...prev, data]);
      setInputMessage("");
      setTimeout(() => {
        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    };

    socket?.on("receive message", handleReceiveMessage);

    return () => {
      socket?.off("receive message", handleReceiveMessage);
    };
  }, [socket, interactingUserId]);

  useEffect(() => {
    // Scroll to typing indicator when other user is typing
    if (otherUserIsTyping && typingIndicatorRef.current) {
      typingIndicatorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [otherUserIsTyping]);

  if (!interactingUserId) {
    return <main className="flex flex-col h-full w-full justify-center items-center">
      <h1 className="text-2xl dark:text-white">Select a chat to view messages</h1>
    </main>
  }


  return (
    <div className="flex flex-col h-full w-full">
      <section className="h-[10%] bg-themeLightPrimary dark:bg-themeDarkPrimary">
        <div className="h-full w-full flex justify-between items-center px-5">
          <div className="flex gap-5 items-center">
            <img src={sender?.avatar} className="h-10 w-10 rounded-full object-cover" />
            <div className="flex flex-col gap-1">
              <h1 className="font-medium text-sm">{sender?.username}</h1>
              <h1 className="font-normal text-xs">Online</h1>
            </div>
          </div>
          <div className="flex items-center gap-11 mr-5">
            <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:rounded-full">
              <Video className="cursor-pointer" color={darkMode === "dark" ? "#919EAB" : "#000"} />
            </div>
            <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700  hover:rounded-full">
              <Phone className="cursor-pointer" color={darkMode === "dark" ? "#919EAB" : "#000"} />
            </div>
            <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:rounded-full">
              <Search className="cursor-pointer" color={darkMode === "dark" ? "#919EAB" : "#000"} />
            </div>
          </div>
        </div>
      </section>
      <section className="flex-1  dark:text-white overflow-auto">
        {messages.map((message, index) => (
          <div key={message.id} ref={index === messages.length - 1 ? lastMessageRef : null} className={`flex mx-8 my-5 ${user?.id === message.senderId ? "justify-end" : "justify-start"}`}>
            <Message message={message} sender={sender} otherUserIsTyping={otherUserIsTyping} />
          </div>
        ))}
        {otherUserIsTyping && <div ref={typingIndicatorRef} className={`${otherUserIsTyping ? "block" : "none"} bg-gray-200 flex gap-2 justify-center items-center w-24 h-12 mx-9 mt-8 rounded-xl relative`}>
          <div className="absolute gap-1 inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-gray-300"></div>
            <div className="h-3 w-3 rounded-full bg-gray-300 mx-1"></div>
            <div className="h-3 w-3 rounded-full bg-gray-300"></div>
          </div>
        </div>}
      </section>
      <section className="h-[10%] bg-themeLightPrimary dark:bg-themeDarkPrimary  dark:text-white flex gap-3 items-center">
        <div className="w-full h-full flex items-center px-5 relative">
          <Paperclip className="absolute top-6.5 left-10 cursor-pointer" height={16} width={16} />
          <Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} value={inputMessage} className="dark:bg-gray-700 px-14" placeholder="Write a message" onChange={(e) => setInputMessage(e.target.value)} />
          <Smile className="absolute top-6.5 right-10 cursor-pointer" height={18} width={18} />
        </div>
        <button disabled={inputMessage === "" || null || undefined} className="h-10 w-10 flex justify-center items-center bg-themeBlue mr-5 rounded-lg" onClick={handleClick}>
          <Send color="white" height={20} width={20} />
        </button>
      </section>
    </div>
  )
}