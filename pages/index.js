import Head from "next/head";
import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";
import {
  Heading,
  Input,
  Stack,
  IconButton,
  Box,
  Flex,
  useToast,
  Button
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

import Character from "../components/Character";

export default function Home(results) {
  const intialState = results;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [characters, setCharacters] = useState(intialState.characters);
  const [info, setInfo] = useState(intialState.info);
  const [error, setErrors] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (page === 1) {
      setCharacters(intialState.characters);
      setInfo(intialState.info);
    } else if (info?.next) {
      async function fetchPaginatedData() {
        const Paginatedresults = await fetch("/api/PaginatedCharacters", {
          method: "post",
          body: page
        });
        const { characters, info, error } = await Paginatedresults.json()
        if (error) {
          setErrors(error)
        } else {
          setCharacters(characters);
          setInfo(info);
        }
      }
      fetchPaginatedData()
    }
  }, [page])

  return (
    <Flex direction="column" justify="center" align="center">
      <Head>
        <title>NextJS Apollo Crash Course</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mb={4} flexDirection="column" align="center" justify="center" py={8}>
        <Heading as="h1" size="2xl" mb={8}>
          Rick and Morty{" "}
        </Heading>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const results = await fetch("/api/SearchCharacters", {
              method: "post",
              body: search,
            });
            const { characters, info, error } = await results.json();
            if (error) {
              setErrors(error)
              toast({
                position: "bottom",
                title: "An error occurred.",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            } else {
              setCharacters(characters);
              setInfo(info);
            }
          }}
        >
          <Stack maxWidth="350px" width="100%" isInline mb={8}>
            <Input
              placeholder="Search"
              value={search}
              border="none"
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
            <IconButton
              colorScheme="blue"
              aria-label="Search database"
              icon={<SearchIcon />}
              disabled={search === ""}
              type="submit"
            />
            <IconButton
              colorScheme="red"
              aria-label="Reset "
              icon={<CloseIcon />}
              disabled={search === ""}
              onClick={async () => {
                setSearch("");
                setCharacters(intialState.characters);
              }}
            />
          </Stack>
        </form>
        <Box px={4} h={8} mb={4}>Current Page: {page}
          <Button
            onClick={() => setPage(old => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Previous Page
            </Button>{' '}
          <Button
            onClick={() => {
              setPage(old => (!intialState.characters || info?.next ? old + 1 : old))
            }}
            disabled={!info?.next}
          >
            Next Page
            </Button>
        </Box>
        {error ? 'Some error occuered' : <Character characters={characters} />}

      </Box>

      <footer className={styles.footer}>
        Powered by Energy Drinks 🥫 and YouTube Subscribers.
      </footer>
    </Flex>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
            next
            prev
          }
          results {
            name
            id
            location {
              name
              id
            }
            image
            origin {
              name
              id
            }
            episode {
              id
              episode
              air_date
            }
          }
        }
      }
    `,
  });

  console.log(data.characters.info)
  return {
    props: {
      characters: data.characters.results,
      info: data.characters.info
    },
  };
}
