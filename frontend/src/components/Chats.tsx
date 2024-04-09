import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

import { useDarkModeContext } from "@/context/darkMode";
import { Input } from "./ui/input";
import Archive from "@/icon/Archive";
import { Separator } from "./ui/separator";
import { useUser } from "@/hooks/useUser";
import { useSocket } from "@/context/socket";

type Props = {
    handleInteractingUserId: (userId: string) => void
}

export default function Chats({ handleInteractingUserId }: Props) {
    const [dbChats, setDbChats] = useState<Chat[]>([])
    const { darkMode } = useDarkModeContext()
    const { user } = useUser()
    const socket = useSocket()


    useEffect(() => {
        const fetchUserChats = async (): Promise<void> => {
            try {
                const response = await axios.post("http://localhost:1337/api/v1/chat/get-user-chats", { userId: user?.id }, { withCredentials: true });
                setDbChats(response.data.message);
            } catch (error) {
                console.error("Error fetching user chats:", error);
            }
        };
        fetchUserChats();
    }, [user?.id]);


    // Reverse the array to find the last occurrence of unique chats
    const reversedChats = dbChats && [...dbChats].reverse() as Chat[];

    // Filter the reversed array to get unique chats where receiverId and senderId match each other
    const uniqueChats = reversedChats?.filter((chat, index, self) => {
        // Find the index of the last chat where senderId matches the current chat's receiverId and vice versa
        const lastIndex = self.findIndex(
            otherChat =>
                (otherChat.senderId === chat.receiverId && otherChat.receiverId === chat.senderId) ||
                (otherChat.receiverId === chat.receiverId && otherChat.senderId === chat.senderId)
        );

        // Only keep the chat if it's the last occurrence of the match
        return lastIndex === index;
    });

    return (
        <section className="w-full h-full py-8 px-5">
            <div className="space-y-6">
                <h1 className="text-xl font-medium dark:text-white">Chats</h1>
                <div className="relative">
                    <Input placeholder="Search..." className="rounded-full pl-12" />
                    <Search className="absolute top-2.5 left-3" height={20} width={20} />
                </div>
                <div className="flex items-center gap-6">
                    <Archive color={darkMode === "dark" ? "white" : "black"} />
                    <h3 className="text-sm text-themeBlue font-medium">Archive</h3>
                </div>
            </div>
            <Separator className="mt-6" />
            <div className="mt-6 scroll-auto space-y-4">
                <p className="text-themeGray font-medium text-sm">All Chats</p>

                <div className="flex flex-col gap-3">
                    {uniqueChats?.map((chat) => (
                        <div key={chat.id} onClick={() => handleInteractingUserId(user?.id === chat?.senderId ? chat?.receiverId : chat.senderId)} className="px-3 bg-white dark:bg-themeDarkSecondary h-20 rounded-xl mb-3 flex justify-between items-center cursor-pointer">
                            <div className="flex gap-4 items-center">
                                <div>
                                    {user?.id === chat?.senderId ? <img src={chat.receiver.avatar} className="h-10 w-10 rounded-full object-cover" /> : <img src={chat.sender.avatar} className="h-10 w-10 rounded-full object-cover" />}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h1 className="font-medium text-sm dark:text-white">
                                        {user?.id === chat.senderId ? chat.receiver.username : chat.sender.username}
                                    </h1>
                                    <h3 className="text-xs text-themeDarkPrimary font-normal dark:text-white">{chat.message}</h3>
                                </div>
                            </div>

                            <div className="text-xs flex flex-col items-center gap-2 pr-5">
                                {/* <p className="text-themeDarkPrimary dark:text-white">{new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p> */}
                                <span className="rounded-full bg-themeBlue h-4 w-4 text-white font-bold text-center dark:text-white">2</span>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </section>
    )
}


