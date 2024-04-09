import io, { Socket } from "socket.io-client";

class SocketService {
    private socket: Socket | null = null;

    constructor(url: string) {
        this.connect(url);
    }

    private connect(url: string): void {
        this.socket = io(url);
    }
    public isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    public emit(event: string, data: any): void {
        if (this.isConnected()) {
            this.socket?.emit(event, data);
        } else {
            console.error("Socket not connected, cannot send message");
        }
    }

    public on(event: string, callback: (data: any) => void): void {
        if (this.isConnected()) {
            this.socket?.on(event, callback);
        } else {
            console.error("Socket not connected, cannot add listener");
        }
    }

    public off(event: string, callback?: (data: any) => void): void {
        if (this.socket) {
            this.socket.off(event, callback);
        } else {
            console.error("Socket not connected, cannot remove listener");
        }
    }
}

export default SocketService;
