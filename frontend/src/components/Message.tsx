import { useUser } from "@/hooks/useUser"

type Props = {
    message: Chat,
    sender: User | null,
    otherUserIsTyping: boolean
}

export default function Message({ message }: Props) {
    const { user } = useUser()
    return (
        <section className={`w-fit h-12 flex px-5 justify-center items-center rounded-xl ${user?.id !== message.senderId ? "bg-themeBlue text-white" : "bg-white dark:bg-themeDarkPrimary"}`}>
            <h1>
                {message.message}
            </h1>
        </section>
    )
}
