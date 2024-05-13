import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import usePostStore from "../store/postStore";
import useShowToast from "../hooks/useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetFeedPosts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const authUser = useAuthStore((state) => state.user);

    const { setUserProfile } = useUserProfileStore();
    const { posts, setPosts } = usePostStore();

    const showToast = useShowToast();

    useEffect(() => {
        const getFeedPosts = async () => {
            setIsLoading(true);

            if (authUser.following.length === 0) {
                setIsLoading(false);
                setPosts([]);
                return;
            }

            const q = query(
                collection(firestore, "posts"),
                where("createdBy", "in", authUser.following)
            );

            try {
                const querySnapshot = await getDocs(q);

                const feedPosts = [];
                querySnapshot.forEach((doc) => {
                    feedPosts.push({ ...doc.data(), id: doc.id });
                });

                feedPosts.sort((a, b) => b.createdAt - a.createdAt);

                setPosts(feedPosts);
            } catch (error) {
                showToast("Error", error.message, "error");
                return;
            } finally {
                setIsLoading(false);
            }
        };

        if (authUser) getFeedPosts();
    }, [authUser, showToast, setUserProfile, setPosts]);

    return { isLoading, posts };
};

export default useGetFeedPosts;
