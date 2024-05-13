import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import ProfilePost from "./ProfilePost";
import useGetUserPosts from "../../hooks/useGetUserPosts";
import { IoCameraOutline } from "react-icons/io5";

const ProfilePosts = () => {
    const { isLoading, posts } = useGetUserPosts();

    const noPostsFound = !isLoading && posts.length === 0;

    if (noPostsFound) return <NoPostsFound />;

    return (
        <Grid
            templateColumns={{
                sm: "repeat(1, 1fr)",
                md: "repeat(3, 1fr)",
            }}
            gap={1}
            columnGap={1}
        >
            {isLoading &&
                [0, 1, 2].map((_, idx) => {
                    return (
                        <VStack key={idx} alignItems={"flex-start"} gap={4}>
                            <Skeleton w={"full"}>
                                <Box h={"300px"}>contents wrapped</Box>
                            </Skeleton>
                        </VStack>
                    );
                })}

            {!isLoading && (
                <>
                    {posts.map((post) => (
                        <ProfilePost post={post} key={post.id} />
                    ))}
                </>
            )}
        </Grid>
    );
};

export default ProfilePosts;

const NoPostsFound = () => {
    return (
        <VStack textAlign={"center"} mx={"auto"} mt={10}>
            <Box
                border={"1px solid gray"}
                borderRadius={"50%"}
                p={3}
                alignItems={"center"}
                justifyContent={"center"}
                color={"gray"}
            >
                <IoCameraOutline size={25} />
            </Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
                No Posts Yet
            </Text>
        </VStack>
    );
};
