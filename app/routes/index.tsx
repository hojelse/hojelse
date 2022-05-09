import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { GraphQLClient, gql } from "graphql-request";

interface Repository {
  name: string
}

interface GetPinnedReposQueryInterface {
  user: {
    name: string,
    pinnedItems: {
      nodes: Repository[]
    }
  }
}

const GetPinnedReposQuery = gql`
  {
    user(login: "hojelse") {
      name,
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
          }
        }
      }
    }
  }
`;

export const loader : LoaderFunction = async (params) => {
  const pat = process.env["OCTOKIT_PAT"]
  
  const githubapi = new GraphQLClient(
    "https://api.github.com/graphql",
    { headers: { Authorization: `bearer ${pat}` } }
  );

  const resp = await githubapi.request(GetPinnedReposQuery);

  return json<GetPinnedReposQueryInterface>(resp)
}

export default function Index() {
  const data = useLoaderData<GetPinnedReposQueryInterface>();
  const repos = data.user.pinnedItems.nodes
  console.dir(data)

  return (
    <div>
      <h1>{data.user.name}</h1>
      <h2>My projects</h2>
      <ul>
        {
          repos.map((repo) => {
            return <li key={repo.name}>{repo.name}</li>
          })
        }
      </ul>
    </div>
  );
}
