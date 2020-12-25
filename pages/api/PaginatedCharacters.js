import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
});

export default async (req, res) => {
    const page = parseInt(req.body);
    try {
        const { data } = await client.query({
            query: gql`
        query{
          characters(page: ${page}) {
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
      `
        });
        res.status(200).json({ characters: data.characters.results, info: data.characters.info, error: null });
    } catch (error) {
        if (error.message === "404: Not Found") {
            res.status(404).json({ characters: null, info: null, error: "No Characters found" });
        } else {
            res
                .status(500)
                .json({ characters: null, info: null, error: "Internal Error, Please try again" });
        }
    }
};