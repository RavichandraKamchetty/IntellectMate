import { Avatar, Flex, Text } from "@chakra-ui/react";
import React from "react";
import useUserProfileStore from "../../store/userProfileStore";
import { timeAgo } from "../../utils/timeAgo";

const Caption = ({ post }) => {
    const userProfile = useUserProfileStore((state) => state.userProfile);

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
                    <Text fontSize={14}>{post.caption}</Text>
                </Flex>
                <Text
                    fontSize={12}
                    fontWeight={"bold"}
                    color={"whiteAlpha.400"}
                >
                    {timeAgo(post.createdAt)}
                </Text>
            </Flex>
        </Flex>
    );
};

export default Caption;
