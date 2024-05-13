import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useLikePost = (post) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [likes, setLikes] = useState(post.likes.length);

    const authUser = useAuthStore((state) => state.user);
    const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?.uid));
    const showToast = useShowToast();

    const handleLikePost = async () => {
        if (!authUser) {
            showToast("Error", "You must be logged in to like", "error");
            return;
        }
        setIsUpdating(true);

        try {
            const postDocRef = doc(firestore, "posts", post.id);

            await updateDoc(postDocRef, {
                likes: isLiked
                    ? arrayRemove(authUser.uid)
                    : arrayUnion(authUser.uid),
            });

            setIsLiked(!isLiked);
            isLiked ? setLikes(likes - 1) : setLikes(likes + 1);
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsUpdating(false);
        }
    };

    return { isLiked, likes, handleLikePost };
};

export default useLikePost;
