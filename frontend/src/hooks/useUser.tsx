import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

interface useUserProps {
    user: User | null;
    setUser: (data: User) => void;
    removeUser: () => void;
}

export const useUser = create(
    devtools(
        persist<useUserProps>(
            (set) => ({
                user: null,
                setUser: (newUser) => set((_state) => ({ user: newUser })),
                removeUser: () => set({ user: null }),
            }),
            {
                name: "auth",
                storage: createJSONStorage(() => sessionStorage),
            }
        )
    )
);