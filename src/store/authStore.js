import { create } from "zustand";

const storedUser = localStorage.getItem("user-info");

// Check if storedUser is neither null nor "undefined"
const initialUser =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

const useAuthStore = create((set) => ({
    user: initialUser,
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
    setUser: (user) => set({ user }),
}));

export default useAuthStore;
