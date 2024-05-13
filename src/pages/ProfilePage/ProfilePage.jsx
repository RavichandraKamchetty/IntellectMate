import {
    Container,
    Flex,
    Link,
    Skeleton,
    SkeletonCircle,
    Text,
    VStack,
} from "@chakra-ui/react";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import ProfilePosts from "../../components/Profile/ProfilePosts";
import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";
import { Link as RouterLink, useParams } from "react-router-dom";

const ProfilePage = () => {
    const { username } = useParams();
    const { isLoading, userProfile } = useGetUserProfileByUsername(username);

    const userNotFound = !isLoading && !userProfile;
    if (userNotFound) return <UserNotFound />;

    return (
        <Container maxW={"container.lg"} py={5}>
            <Flex
                py={10}
                px={4}
                flexDirection={"column"}
                pl={{ base: 4, md: 10 }}
                w={"full"}
                mx={"auto"}
            >
                {!isLoading && userProfile && <ProfileHeader />}
                {isLoading && <ProfileHeaderSkeleton />}
            </Flex>

            <Flex
                px={{ base: 2, sm: 4 }}
                maxW={"full"}
                mx={"auto"}
                borderTop={"1px solid"}
                borderColor={"whiteAlpha.300"}
                direction={"column"}
            >
                <ProfileTabs />
                <ProfilePosts />
            </Flex>
        </Container>
    );
};

export default ProfilePage;

const UserNotFound = () => {
    return (
        <Flex flexDir={"column"} textAlign={"center"} mx={"auto"}>
            <Text fontSize={"2xl"}>User Not Found</Text>

            <Link
                as={RouterLink}
                to={"/"}
                color={"blue.500"}
                w={"max-content"}
                mx={"auto"}
            >
                Go Home
            </Link>
        </Flex>
    );
};

const ProfileHeaderSkeleton = () => {
    return (
        <Flex
            gap={{ base: 4, sm: 10 }}
            py={10}
            direction={{ base: "column", sm: "row" }}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <SkeletonCircle size={24} />

            <VStack
                gap={2}
                alignItems={{ base: "center", sm: "flex-start" }}
                mx={"auto"}
                flex={1}
            >
                <Skeleton h={"12px"} w={"150px"} />
                <Skeleton h={"12px"} w={"150px"} />
            </VStack>
        </Flex>
    );
};
