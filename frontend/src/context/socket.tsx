import React, { createContext, useContext, useMemo } from "react";
import SocketService from "../lib/socketService";

const SocketContext = createContext<SocketService | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider= ({ children }: { children: React.ReactNode }) => {
    const url = "http://localhost:1337"
    const socketService = useMemo(() => new SocketService(url), [url]);

    return <SocketContext.Provider value={socketService}>{children}</SocketContext.Provider>;
};
