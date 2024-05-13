import {
    Avatar,
    Flex,
    Skeleton,
    SkeletonCircle,
    Text,
    VStack,
} from "@chakra-ui/react";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import { timeAgo } from "../../utils/timeAgo";

const Comment = ({ comment }) => {
    const { isLoading, userProfile } = useGetUserProfileById(
        comment.createdBy
    );
    
    if (isLoading) return <CommentSkeleton />;

    return (
        <Flex gap={4}>
            <Avatar
                src={userProfile?.profilePicURL}
                alt={userProfile?.username}
                size={"sm"}
            />
            <Flex direction={"column"}>
                <Flex gap={2}>
                    <Text fontSize={12} fontWeight={"bold"}>
                        {userProfile?.username}
                    </Text>
                    <Text fontSize={14}>{comment.comment}</Text>
                </Flex>
                <Text
                    fontSize={12}
                    fontWeight={"bold"}
                    color={"whiteAlpha.400"}
                >
                    {timeAgo(comment.createdAt)}
                </Text>
            </Flex>
        </Flex>
    );
};

export default Comment;

const CommentSkeleton = () => {
    return (
        <Flex gap={4} w="full" alignItems={"center"}>
            <SkeletonCircle h={10} w={10} />
            <Flex gap={1} flexDir={"column"}>
                <Skeleton h={2} w={100} />
                <Skeleton h={2} w={50} />
            </Flex>
        </Flex>
    );
};
