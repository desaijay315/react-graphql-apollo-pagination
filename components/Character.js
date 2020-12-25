import React from "react";
import Image from "next/image";
import { Heading, Text, SimpleGrid, Link } from "@chakra-ui/react";
import NextLink from "next/link";


const Character = ({ characters }) => {

    return (
        <SimpleGrid columns={[1, 2, 3]} spacing="40px">
            {characters.map((character) => {
                return (
                    <div key={character.id}>
                        <Image src={character.image} width={300} height={300} />
                        <Heading as="h4" align="center" size="md">
                            {character.name}
                        </Heading>
                        <NextLink href="/location/[id]" as={`/location/${character.location.id}`}>
                            <Link><Text align="center">Origin: {character.origin.name}</Text></Link>
                        </NextLink>
                        <NextLink href="/location/[id]" as={`/location/${character.location.id}`}>
                            <Link><Text align="center">Location: {character.location.name}</Text></Link>
                        </NextLink>
                    </div>
                );
            })}
        </SimpleGrid>
    );
};

export default Character;