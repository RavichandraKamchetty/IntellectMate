import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { firestore, storage } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useUserProfileStore from "../store/userProfileStore";

const useEditProfile = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const authUser = useAuthStore((state) => state.user);

    const setAuthUser = useAuthStore((state) => state.setUser);

    const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

    const showToast = useShowToast();

    const editProfile = async (inputs, selectedFile) => {
        if (isUpdating || !authUser) return;

        setIsUpdating(true);

        const storageRef = ref(storage, `profilePics/${authUser.uid}`);
        const userDocRef = doc(firestore, "users", authUser.uid);

        try {
            let profilePicURL = authUser.profilePicURL; // Default to current value

            if (selectedFile) {
                await uploadString(storageRef, selectedFile, "data_url");
                const downloadURL = await getDownloadURL(storageRef);
                profilePicURL = downloadURL;
            }

            const updatedUser = {
                ...authUser,
                fullName: inputs.fullName || authUser.fullName,
                username: inputs.username || authUser.username,
                bio: inputs.bio || authUser.bio,
                profilePicURL: profilePicURL,
            };

            console.log(updatedUser);

            await updateDoc(userDocRef, updatedUser);

            localStorage.setItem("user-info", JSON.stringify(updatedUser));

            setAuthUser(updatedUser);

            setUserProfile(updatedUser);

            showToast("Success", "Profile Updated Successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        }
    };

    return { isUpdating, editProfile };
};

export default useEditProfile;
