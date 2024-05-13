import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const usePreviewImg = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const showToast = useShowToast();

    const maxFileSizeInBytes = 3.5 * 1000 * 1000; // 3MB

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith("image/")) {
            if (file.size > maxFileSizeInBytes) {
                showToast("Error", "File size must be less than 3.5MB", "error");
                setSelectedFile(null);
                return;
            }

            const reader = new FileReader();

            reader.onloadend = () => {
                setSelectedFile(reader.result);
            };

            reader.readAsDataURL(file);
        } else {
            showToast("Error", "Please select an image file", "error");
            setSelectedFile(null);
            return;
        }
    };

    return { selectedFile, handleImageChange, setSelectedFile };
};

export default usePreviewImg;
