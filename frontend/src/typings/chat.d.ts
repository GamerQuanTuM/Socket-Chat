type Chat = {
    id: string,
    message: string,
    senderId: string,
    receiverId: string,
    createdAt: string,
    updatedAt: string,
    sender: User,
    receiver: User
}