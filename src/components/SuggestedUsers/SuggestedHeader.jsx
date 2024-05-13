import { Avatar, Flex, Text, Button } from "@chakra-ui/react";
import React from "react";
import useLogout from "../../hooks/useLogout";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

const SuggestedHeader = () => {
    const { handleLogout, isLoggingOut } = useLogout();
    const authUser = useAuthStore((state) => state.user);

    if (!authUser) return null;

    return (
        <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
            <Flex alignItems={"center"} gap={2}>
                <Link to={`${authUser.username}`}>
                    <Avatar
                        src={authUser.profilePicURL}
                        alt="Profile pic"
                        size={"sm"}
                    />
                </Link>
                <Link to={`${authUser.username}`}>
                    <Text fontSize={14} fontWeight={"bold"}>
                        {authUser.username}
                    </Text>
                </Link>
            </Flex>

            <Button
                size={"xs"}
                background={"transparent"}
                _hover={{ background: "transparent" }}
                cursor={"pointer"}
                fontSize={14}
                color={"blue.500"}
                fontWeight={"medium"}
                onClick={handleLogout}
                isLoading={isLoggingOut}
            >
                Log out
            </Button>
        </Flex>
    );
};

export default SuggestedHeader;
