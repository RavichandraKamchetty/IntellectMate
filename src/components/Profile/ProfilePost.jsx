import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    GridItem,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Comment from "../Comment/Comment";
import PostFooter from "../FeedPosts/PostFooter";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import { useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { deleteObject, ref } from "firebase/storage";
import { firestore, storage } from "../../firebase/firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import usePostStore from "../../store/postStore";
import Caption from "../Comment/Caption";

const ProfilePost = ({ post }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const userProfile = useUserProfileStore((state) => state.userProfile);
    const authUser = useAuthStore((state) => state.user);

    const [isDeleting, setIsDeleting] = useState(false);
    const deletePost = usePostStore((state) => state.deletePost);
    const decrementPostCount = useUserProfileStore((state) => state.deletePost);
    const showToast = useShowToast();

    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete the post?"))
            return;

        setIsDeleting(true);
        try {
            const imageRef = ref(storage, `posts/${post.id}`);
            await deleteObject(imageRef);

            const postDocRef = doc(firestore, "posts", post.id);
            console.log(postDocRef)
            await deleteDoc(postDocRef);

            const userRef = doc(firestore, "users", authUser.uid);

            await updateDoc(userRef, {
                posts: arrayRemove(post.id),
            });

            deletePost(post.id);
            decrementPostCount(post.id);

            showToast("Success", "Post Deleted Successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <GridItem
                cursor={"pointer"}
                border={"1px solid"}
                borderColor={"whiteAlpha.300"}
                borderRadius={4}
                overflow={"hidden"}
                position={"relative"}
                aspectRatio={1 / 1}
                onClick={onOpen}
            >
                <Flex
                    opacity={0}
                    _hover={{ opacity: 1 }}
                    position={"absolute"}
                    top={0}
                    bottom={0}
                    left={0}
                    right={0}
                    bg={"blackAlpha.700"}
                    transition={"all 0.3s ease"}
                    zIndex={1}
                    justifyContent={"center"}
                    border={"1px solid black"}
                >
                    <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={50}
                    >
                        <Flex>
                            <AiFillHeart size={20} />
                            <Text fontWeight={"bold"} ml={2}>
                                {post.likes.length}
                            </Text>
                        </Flex>

                        <Flex>
                            <FaComment size={20} />
                            <Text fontWeight={"bold"} ml={2}>
                                {post.comments.length}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Image
                    src={post.imageURL}
                    alt="Post"
                    w={"100%"}
                    h={"100%"}
                    objectFit={"cover"}
                />
            </GridItem>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered={true}
                size={{ base: "3xl", md: "5xl" }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody bg={"black"}>
                        <Flex
                            gap={4}
                            mx={"auto"}
                            w={{ base: "90%", sm: "70%", md: "full" }}
                            maxH={"90vh"}
                            minH={"50vh"}
                        >
                            <Flex
                                borderRadius={4}
                                overflow={"hidden"}
                                border={"1px solid"}
                                borderColor={"whiteAlpha.300"}
                                flex={1}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                <Image src={post.imageURL} alt="Post" />{" "}
                                {/* h={"350px"} w={"full"}*/}
                            </Flex>

                            <Flex
                                flex={1}
                                flexDir={"column"}
                                px={10}
                                display={{ base: "none", md: "flex" }}
                                my={5}
                            >
                                <Flex
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                >
                                    <Flex gap={4} alignItems={"center"}>
                                        <Avatar
                                            src={userProfile.profilePicURL}
                                            alt={"Profile Pic"}
                                            size={"sm"}
                                            name="Ravi Chandra"
                                        />
                                        <Text fontWeight={"bold"} fontSize={12}>
                                            {userProfile.username}
                                        </Text>
                                    </Flex>
                                    {authUser?.uid === userProfile.uid && (
                                        <Button
                                            size={"sm"}
                                            bg={"transparent"}
                                            _hover={{
                                                bg: "whiteAlpha.400",
                                                color: "red.600",
                                            }}
                                            borderRadius={4}
                                            p={1}
                                            onClick={handleDeletePost}
                                            isLoading={isDeleting}
                                        >
                                            <MdDelete
                                                size={20}
                                                cursor={"pointer"}
                                            />
                                        </Button>
                                    )}
                                </Flex>
                                <Divider my={4} bg={"gray.500"} />

                                <VStack
                                    w={"full"}
                                    maxH={"350px"}
                                    overflowY={"auto"}
                                    alignItems={"start"}
                                >
                                    {/* CAPTION */}
                                    {post.caption && <Caption post={post} />}

                                    {/* COMMENT */}
                                    {post.comments.map((comment) => (
                                        <Comment
                                            key={comment.createdBy}
                                            comment={comment}
                                        />
                                    ))}
                                </VStack>

                                <PostFooter isProfilePage={true} post={post} />
                            </Flex>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfilePost;
