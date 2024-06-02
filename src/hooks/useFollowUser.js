import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { firestore } from "../firebase/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const useFollowUser = (userId) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const { userProfile, setUserProfile } = useUserProfileStore();

    const authUser = useAuthStore((state) => state.user);
    const setAuthUser = useAuthStore((state) => state.setUser);

    const showToast = useShowToast();

    const handleFollowUser = async () => {
        setIsUpdating(true); 
        try {
            const currentUserRef = doc(firestore, "users", authUser.uid);
            const userToFollowOrUnFollowRef = doc(firestore, "users", userId);

            await updateDoc(currentUserRef, {
                following: isFollowing
                    ? arrayRemove(userId)
                    : arrayUnion(userId),
            });

            await updateDoc(userToFollowOrUnFollowRef, {
                followers: isFollowing
                    ? arrayRemove(authUser.uid)
                    : arrayUnion(authUser.uid),
            });

            if (isFollowing) {
                // unfollow
                setAuthUser({
                    ...authUser,
                    following: authUser.following.filter(
                        (uid) => uid !== userId
                    ),
                });

                if (userProfile) {
                    setUserProfile({
                        ...userProfile,
                        followers: userProfile.followers.filter(
                            (uid) => uid !== authUser.uid
                        ),
                    });

                    localStorage.setItem(
                        "user-info",
                        JSON.stringify({
                            ...authUser,
                            following: authUser.following.filter(
                                (uid) => uid !== userId
                            ),
                        })
                    );
                }

                setIsFollowing(false);
            } else {
                // follow
                setAuthUser({
                    ...authUser,
                    following: [...authUser.following, userId],
                });

                if (userProfile) {
                    setUserProfile({
                        ...userProfile,
                        followers: [...userProfile.followers, authUser.uid],
                    });

                    localStorage.setItem(
                        "user-info",
                        JSON.stringify({
                            ...authUser,
                            following: [...authUser.following, userId],
                        })
                    );
                }

                setIsFollowing(true);
            }
        } catch (error) {
            console.log(error);
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        if (authUser) {
            const isFollowing = authUser.following.includes(userId);
            setIsFollowing(isFollowing);
        }
    }, [authUser, userId]);

    return { isFollowing, isUpdating, handleFollowUser };
};

export default useFollowUser;
