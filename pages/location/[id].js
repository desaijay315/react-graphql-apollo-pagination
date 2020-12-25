import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import {
    Box,
    Flex
} from "@chakra-ui/react";

export default function Location(results) {
    return (
        <Flex direction="column" justify="center" align="center" mt={10}>
            <Box maxW="lg" borderWidth="1px" borderRadius="lg" overflow="hidden" justify="center" mt={10}>
                <Box p="6">
                    <Box d="flex" alignItems="baseline">
                        <Box
                            color="gray.500"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            textTransform="uppercase"
                            ml="2"
                        >
                            {results.location.id} &bull; {results.location.name}
                        </Box>
                    </Box>

                    <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                    >
                        {results.location.type}
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
};

export async function getServerSideProps({ params }) {
    const client = new ApolloClient({
        uri: "https://rickandmortyapi.com/graphql/",
        cache: new InMemoryCache(),
    });

    const { data } = await client.query({
        query: gql`
        query {
            location(id: ${params.id}){
                id
                name
                type
                created
            }
        }
      `
    });
    return {
        props: {
            location: data.location
        },
    };
}
