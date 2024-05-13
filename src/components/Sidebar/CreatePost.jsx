import {
    Avatar,
    Box,
    Button,
    CloseButton,
    Flex,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import { BsFillImageFill } from "react-icons/bs";
import { useRef, useState } from "react";
import usePreviewImg from "../../hooks/usePreviewImg";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import useUserProfileStore from "../../store/userProfileStore";
import usePostStore from "../../store/postStore";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useLocation } from "react-router-dom";

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [caption, setCaption] = useState("");
    const showToast = useShowToast();

    const { selectedFile, handleImageChange, setSelectedFile } =
        usePreviewImg();

    const { isLoading, handleCreatePost } = useCreatePost();

    const imageRef = useRef(null);

    const handlePostCreation = async () => {
        try {
            await handleCreatePost(selectedFile, caption);
            onClose();
            setCaption("");
            setSelectedFile(null);
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        }
    };

    return (
        <>
            <Tooltip
                hasArrow
                label="Create"
                placement="right"
                ml={1}
                openDelay={500}
                display={{ base: "block", md: "none" }}
            >
                <Flex
                    alignItems={"center"}
                    gap={4}
                    _hover={{ bg: "whiteAlpha.400" }}
                    borderRadius={6}
                    p={2}
                    w={{ base: 10, md: "full" }}
                    justifyContent={{
                        base: "center",
                        md: "flex-start",
                    }}
                    onClick={onOpen}
                >
                    <CreatePostLogo />
                    <Box
                        display={{ base: "none", md: "block" }}
                        fontWeight={"bold"}
                    >
                        Create
                    </Box>
                </Flex>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent bg={"black"} border={"1px solid gray"}>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <Textarea
                            placeholder="Post Caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />

                        <Input
                            type="file"
                            hidden
                            ref={imageRef}
                            onChange={handleImageChange}
                        />

                        <BsFillImageFill
                            size={16}
                            style={{
                                marginTop: "15px",
                                marginLeft: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => imageRef.current.click()}
                        />

                        {selectedFile && (
                            <Flex
                                mt={5}
                                w={"full"}
                                justifyContent={"center"}
                                position={"relative"}
                            >
                                <Image src={selectedFile} alt="Selected Img" />
                                <CloseButton
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                    border={"1px solid black"}
                                    color={"white"}
                                    fontWeight={"bold"}
                                    onClick={() => setSelectedFile(null)}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            mr={3}
                            onClick={handlePostCreation}
                            isLoading={isLoading}
                        >
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;

function useCreatePost() {
    const showToast = useShowToast();
    const [isLoading, setIsLoading] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const addPost = useUserProfileStore((state) => state.addPost);
    const createPost = usePostStore((state) => state.createPost);
    const userProfile = useUserProfileStore((state) => state.userProfile);
    const { pathname } = useLocation();

    const handleCreatePost = async (selectedFile, caption) => {
        if (!selectedFile) throw new Error("Please select an image");
        setIsLoading(true);

        const newPost = {
            caption: caption,
            likes: [],
            comments: [],
            createdAt: Date.now(),
            createdBy: authUser.uid,
        };

        try {
            const postDocRef = await addDoc(
                collection(firestore, "posts"),
                newPost
            );
            const userDocRef = doc(firestore, "users", authUser.uid);
            const imageRef = ref(storage, `posts/${postDocRef.id}`);

            await updateDoc(userDocRef, {
                posts: arrayUnion(postDocRef.id),
            });

            await uploadString(imageRef, selectedFile, "data_url");
            const downloadURL = await getDownloadURL(imageRef);

            await updateDoc(postDocRef, { imageURL: downloadURL });

            newPost.imageURL = downloadURL;

            if (userProfile.uid === authUser.uid)
                createPost({ ...newPost, id: postDocRef.id });
            if (pathname !== "/" && userProfile.uid === authUser.uid)
                addPost({ ...newPost, id: postDocRef.id });

            showToast("Success", "Post Created Successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleCreatePost };
}
