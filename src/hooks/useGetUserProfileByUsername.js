import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetUserProfileByUsername = (username) => {
    const [isLoading, setIsLoading] = useState(true);

    const showToast = useShowToast();

    // const { userProfile, setUserProfile } = useUserProfileStore();

    const userProfile = useUserProfileStore((state) => state.userProfile)
    const setUserProfile = useUserProfileStore((state) => state.setUserProfile)

    useEffect(() => {
        const getUserProfile = async () => {
            setIsLoading(true);

            try {
                const q = query(
                    collection(firestore, "users"),
                    where("username", "==", username)
                );
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    return setUserProfile(null);
                }

                let userDoc;
                querySnapshot.forEach((doc) => {
                    userDoc = doc.data();
                });

                setUserProfile(userDoc);
                console.log(userDoc)
            } catch (error) {
                showToast("Error", error.message, "error");
                return;
            } finally {
                setIsLoading(false);
            }
        };

        getUserProfile();
    }, [username]);

    return { isLoading, userProfile };
};

export default useGetUserProfileByUsername;
