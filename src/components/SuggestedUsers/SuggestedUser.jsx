import { Avatar, Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import useFollowUser from "../../hooks/useFollowUser";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

const SuggestedUser = ({ user, setUser }) => {
    const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(
        user.uid
    );
    const authUser = useAuthStore((state) => state.user);

    const onFollowUser = async () => {
        await handleFollowUser();
        setUser({
            ...user,
            followers: isFollowing
                ? user.followers.filter(
                      (follower) => follower.uid !== authUser.uid
                  )
                : [...user.followers, authUser],
        });
    };

    return (
        <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
            <Flex alignItems={"center"} gap={2}>
                <Link to={`/${user.username}`}>
                    <Avatar
                        src={user.profilePicURL}
                        alt={user.username}
                        size={"md"}
                    />
                </Link>
                <VStack spacing={0} alignItems={"flex-start"}>
                    <Link to={`/${user.username}`}>
                        <Box fontSize={14} fontWeight={"bold"}>
                            {user.fullName}
                        </Box>
                    </Link>
                    <Box color={"gray.500"} fontSize={14}>
                        {user.followers.length} followers
                    </Box>
                </VStack>
            </Flex>

            {authUser?.uid !== user?.uid && (
                <Button
                    fontSize={13}
                    cursor={"pointer"}
                    bg={"transparent"}
                    p={0}
                    h={"max-content"}
                    fontWeight={"medium"}
                    color={"blue.400"}
                    _hover={{ color: "white" }}
                    isLoading={isUpdating}
                    onClick={onFollowUser}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Button>
            )}
        </Flex>
    );
};

export default SuggestedUser;
