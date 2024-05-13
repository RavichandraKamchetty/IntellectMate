import {
    Flex,
    Text,
    VStack,
    Link,
    Box,
    SkeletonCircle,
    Skeleton,
} from "@chakra-ui/react";
import React from "react";
import SuggestedUser from "./SuggestedUser";
import SuggestedHeader from "./SuggestedHeader";
import useGetSuggestedUsers from "../../hooks/useGetSuggestedUsers";

const SuggestedUsers = () => {
    const { isLoading, suggestedUsers } = useGetSuggestedUsers();

    return (
        <VStack gap={4} py={8} px={6}>
            {!isLoading && <SuggestedHeader />}

            {!isLoading && suggestedUsers.length !== 0 && (
                <Flex
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    w="full"
                >
                    <Text fontSize={14} fontWeight={"bold"} color={"gray.500"}>
                        Suggested for you
                    </Text>
                    <Text
                        fontSize={14}
                        fontWeight={"bold"}
                        _hover={{ color: "gray.400" }}
                        cursor={"pointer"}
                    >
                        See All
                    </Text>
                </Flex>
            )}

            {isLoading && (
                <VStack>
                    <Flex gap={2}>
                        <SkeletonCircle size={10} />
                        <VStack
                            gap={2}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Skeleton h="10px" w={"200px"} />
                            <Skeleton h="10px" w={"200px"} />
                        </VStack>
                    </Flex>
                    <Flex
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        w={"full"}
                        mt={1}
                    >
                        <Skeleton h="10px" w={"100px"} />
                        <Skeleton h="10px" w={"50px"} />
                    </Flex>
                </VStack>
            )}

            {isLoading &&
                [0, 1, 2].map((_, idx) => (
                    <VStack key={idx} gap={2} alignItems={"flex-start"}>
                        <Flex gap={2}>
                            <SkeletonCircle size={10} />
                            <VStack
                                gap={2}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <Skeleton h="10px" w={"200px"} />
                                <Skeleton h="10px" w={"200px"} />
                            </VStack>
                        </Flex>
                    </VStack>
                ))}

            {isLoading && (
                <Box alignItems={"flex-start"} mt={3} w={"full"}>
                    <Skeleton h="10px" w={"200px"} />
                </Box>
            )}

            {!isLoading &&
                suggestedUsers.map((user) => (
                    <SuggestedUser user={user} key={user.id} />
                ))}

            {!isLoading && (
                <Box
                    fontSize={14}
                    color={"gray.500"}
                    mt={5}
                    alignSelf={"start"}
                >
                    © 2024 Built By{" "}
                    <Link
                        href="https://ravi-rc-portfolio.netlify.app/"
                        target="_blank"
                        color="blue.500"
                        fontSize={14}
                    >
                        Ravi Chandra
                    </Link>
                </Box>
            )}
        </VStack>
    );
};

export default SuggestedUsers;
