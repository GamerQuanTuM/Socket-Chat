import { MessageCircleMore, Phone, Settings, Users } from "lucide-react"
import { useState } from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Logo from "@/assets/logo.ico"
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/hooks/useUser"
import { useDarkModeContext } from "@/context/darkMode"
import { Chats, Messages } from "@/components"


type iconState = "message" | "group" | "phone" | "setting"

export default function Home() {
  const [activeIcon, setActiveIcon] = useState<iconState>("message");
  const [interactingUserId, setInteractingUserId] = useState<string | null>(null)
  const { user } = useUser()

  const { darkMode, toggleDarkMode } = useDarkModeContext();

  const handleActiveIcon = (icon: iconState): void => {
    setActiveIcon(icon)
  }

  const handleInteractingUserId = (userId: string) => {
    setInteractingUserId(userId)
  }

  const handleThemeChange = () => {
    if (darkMode === 'dark') {
      toggleDarkMode()
    } else if (darkMode === "light") {
      toggleDarkMode()
    }
  };


  return (
    <main className={`h-screen w-screen flex ${darkMode === 'dark' ? 'dark' : ''} font-poppins`}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={7} className={"dark:bg-themeDarkPrimary"}>
          <div className="w-full h-full py-4 flex flex-col items-center justify-between">
            <div className="flex flex-col items-center gap-8">
              <div className="w-16 h-16 bg-themeBlue rounded-xl">
                <img src={Logo} alt="Logo.ico" />
              </div>
              <div className="flex flex-col items-center gap-10">
                <div className={`w-11 h-11 ${activeIcon === "message" ? "bg-themeBlue" : "bg-white dark:bg-gray-800"} cursor-pointer rounded-xl flex items-center justify-center`} onClick={() => handleActiveIcon("message")}>
                  {darkMode != "dark" ? <MessageCircleMore color={activeIcon === "message" ? "white" : "black"} height={27} width={27} /> : <MessageCircleMore color={darkMode === 'dark' ? 'white' : 'black'} height={27} width={27} />}
                </div>
                <div className={`w-11 h-11 ${activeIcon === "group" ? "bg-themeBlue" : "bg-white dark:bg-gray-800"} cursor-pointer rounded-xl flex items-center justify-center`} onClick={() => handleActiveIcon("group")}>
                  {darkMode != "dark" ? <Users color={activeIcon === "group" ? "white" : "black"} height={27} width={27} /> : <Users color={darkMode === 'dark' ? 'white' : 'black'} height={27} width={27} />}
                </div>
                <div className={`w-11 h-11 ${activeIcon === "phone" ? "bg-themeBlue" : "bg-white dark:bg-gray-800"} cursor-pointer rounded-xl flex items-center justify-center`} onClick={() => handleActiveIcon("phone")}>
                  {darkMode != "dark" ? <Phone color={activeIcon === "phone" ? "white" : "black"} height={27} width={27} /> : <Phone color={darkMode === 'dark' ? 'white' : 'black'} height={27} width={27} />}
                </div>
                <div className={`w-11 h-11 ${activeIcon === "setting" ? "bg-themeBlue" : "bg-white dark:bg-gray-800"} cursor-pointer rounded-xl flex items-center justify-center`} onClick={() => handleActiveIcon("setting")}>
                  {darkMode != "dark" ? <Settings color={activeIcon === "setting" ? "white" : "black"} height={27} width={27} /> : <Settings color={darkMode === 'dark' ? 'white' : 'black'} height={27} width={27} />}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-7">
              <Switch checked={darkMode === 'dark'} onCheckedChange={handleThemeChange} />
              <img src={user?.avatar} className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25} className="bg-themeLightPrimary dark:bg-themeDarkPrimary dark:text-white">
          <Chats handleInteractingUserId={handleInteractingUserId} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="bg-themeLightSecondary dark:bg-themeDarkSecondary dark:text-white" defaultSize={100 - 32}>
          <Messages interactingUserId={interactingUserId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}
