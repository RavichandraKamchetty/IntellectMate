import { useEffect, useState } from "react";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetUserPosts = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const showToast = useShowToast();

    const userProfile = useUserProfileStore((state) => state.userProfile);

    useEffect(() => {
        const getPosts = async () => {
            if (!userProfile) return;
            setIsLoading(true);
            setPosts([]);

            try {
                const q = query(
                    collection(firestore, "posts"),
                    where("createdBy", "==", userProfile.uid)
                );

                const querySnapshot = await getDocs(q);

                const posts = [];
                querySnapshot.forEach((doc) => {
                    posts.push({ ...doc.data(), id: doc.id });
                });

                posts.sort((a, b) => b.createdAt - a.createdAt);
                console.log(posts)

                setPosts(posts);
            } catch (error) {
                showToast("Error", error.message, "error");
                setPosts([]);
                return;
            } finally {
                setIsLoading(false);
            }
        };

        getPosts();
    }, [setPosts, userProfile, showToast]);

    return { isLoading, posts };
};

export default useGetUserPosts;
