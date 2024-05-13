import {
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import Comment from "../Comment/Comment";
import usePostComment from "../../hooks/usePostComment";
import { useEffect, useRef } from "react";

const CommentModal = ({ isOpen, onClose, post }) => {
    const commentRef = useRef(null);
    const commentContainerRef = useRef(null);
    const { isCommenting, handlePostComment } = usePostComment();
    console.log(post);

    const handleSubmitComment = async (e) => {
        // do not refresh the page, prevent it
        e.preventDefault();

        await handlePostComment(post.id, commentRef.current.value);
        commentRef.current.value = "";
    };

    useEffect(() => {
        const scrollToBottom = () => {
            commentContainerRef.current.scrollTop =
                commentContainerRef.current.scrollHeight;
        };

        if (isOpen) {
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [isOpen, post.comments.length]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
            <ModalOverlay />
            <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
                <ModalHeader>Comments</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    <Flex
                        mb={4}
                        gap={4}
                        flexDir={"column"}
                        maxH={"250px"}
                        overflowY={"auto"}
                        ref={commentContainerRef}
                    >
                        {post.comments.map((comment, idx) => {
                            return <Comment key={idx} comment={comment} />;
                        })}
                    </Flex>
                    <form style={{ marginTop: "2rem" }}>
                        <Input
                            placeholder="Comment"
                            size={"sm"}
                            ref={commentRef}
                        />
                        <Flex w={"full"} justifyContent={"flex-end"}>
                            <Button
                                type="submit"
                                ml={"auto"}
                                size={"sm"}
                                my={4}
                                onClick={handleSubmitComment}
                                isLoading={isCommenting}
                            >
                                Post
                            </Button>
                        </Flex>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CommentModal;
