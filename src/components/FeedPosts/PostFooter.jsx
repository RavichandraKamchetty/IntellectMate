import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
    CommentLogo,
    NotificationsLogo,
    UnlikeLogo,
} from "../../assets/constants";
import usePostComment from "../../hooks/usePostComment";
import useAuthStore from "../../store/authStore";
import useLikePost from "../../hooks/useLikePost";
import { timeAgo } from "../../utils/timeAgo";
import CommentModal from "../Modals/CommentModal";

const PostFooter = ({ post, creatorProfile, isProfilePage }) => {
    const { isCommenting, handlePostComment } = usePostComment();
    const [comment, setComment] = useState("");
    const authUser = useAuthStore((state) => state.user);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const commentRef = useRef(null);

    const { isLiked, likes, handleLikePost } = useLikePost(post);

    const handleSubmitComment = async () => {
        await handlePostComment(post.id, comment);
        setComment("");
    };

    return (
        <Box mb={isProfilePage ? "0" : "10"} marginTop={"auto"}>
            <Flex alignItems={"center"} gap={2} w={"full"} pt={0} mt={4} mb={2}>
                <Box onClick={handleLikePost} cursor={"pointer"} fontSize={18}>
                    {!isLiked ? <NotificationsLogo /> : <UnlikeLogo />}
                </Box>

                <Box
                    cursor={"pointer"}
                    fontSize={18}
                    onClick={() => commentRef.current.focus()}
                >
                    <CommentLogo />
                </Box>
            </Flex>

            <Text fontSize={18} fontWeight={600}>
                {likes} likes
            </Text>

            {isProfilePage && (
                <Text fontSize={12} color={"gray"}>
                    Posted {timeAgo(post.createdAt)}
                </Text>
            )}

            {!isProfilePage && (
                <>
                    <Text fontWeight={700} fontSize={"sm"}>
                        {creatorProfile?.username}{" "}
                        <Text as={"span"} fontWeight={400}>
                            {post.caption}
                        </Text>
                    </Text>

                    {post.comments.length > 0 && (
                        <Text
                            color={"gray"}
                            fontSize={"sm"}
                            onClick={onOpen}
                            cursor={"pointer"}
                        >
                            View all {post.comments.length} comments
                        </Text>
                    )}

                    {isOpen ? (
                        <CommentModal
                            isOpen={isOpen}
                            onClose={onClose}
                            post={post}
                        />
                    ) : null}
                </>
            )}

            {authUser && (
                <Flex
                    alignItems={"center"}
                    gap={2}
                    justifyContent={"space-between"}
                    w={"full"}
                >
                    <InputGroup>
                        <Input
                            variant={"flushed"}
                            placeholder="Add a Comment..."
                            fontSize={14}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            ref={commentRef}
                        />
                        <InputRightElement>
                            <Button
                                fontSize={14}
                                color={"blue.500"}
                                fontWeight={500}
                                cursor={"pointer"}
                                _hover={{ color: "white" }}
                                bg={"transparent"}
                                onClick={handleSubmitComment}
                                isLoading={isCommenting}
                            >
                                Post
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Flex>
            )}
        </Box>
    );
};

export default PostFooter;
