import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSearchUser = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const showToast = useShowToast();

    const getUserProfile = async (username) => {
        setIsLoading(true);
        setUser(null);

        try {
            const q = query(
                collection(firestore, "users"),
                where("username", "==", username)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                showToast("Error", "No User Found", "error");
                return;
            }

            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (error) {
            showToast("Error", error.message, "error");
            setUser(null);
            return;
        } finally {
            setIsLoading(false);
        }
    };

    return { user, isLoading, getUserProfile, setUser };
};

export default useSearchUser;
