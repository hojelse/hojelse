import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { GraphQLClient, gql } from "graphql-request";

interface Topic {
  name: string
}

interface RepositoryTopic {
  topic: Topic
}

interface Release {
  tagName: string
  description: string
}

interface UserStatus {
  emoji: string
  message: string
}

interface Language {
  name: string
}

interface Repository {
  url: URL
  name: string
  nameWithOwner: string
  description: string
  stargazerCount: number
  openGraphImageUrl: URL
  primaryLanguage: Language
  latestRelease: Release
  languages: {
    nodes: Language[]
  }
  repositoryTopics: {
    nodes: RepositoryTopic[]
  }
}

interface GetPinnedReposQueryInterface {
  user: {
    name: string
    url: URL
    bio: string
    login: string
    status: UserStatus
    pinnedItems: {
      nodes: Repository[]
    }
  }
}


const GetPinnedReposQuery = gql`
  {
    user(login: "hojelse") {
      name,
      url,
      bio,
      login,
      status {
        ... on UserStatus {
          emoji,
          message
        }
      },
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            url,
            nameWithOwner,
            name,
            description,
            stargazerCount,
            openGraphImageUrl,
            primaryLanguage {
              ... on Language {
                name
              }
            },
            repositoryTopics(first: 20) {
              nodes {
                ... on RepositoryTopic {
                  topic {
                    ... on Topic {
                      name
                    }
                  }
                }
              }
            },
            languages(first: 20) {
              nodes {
                ... on Language {
                  name
                }
              }
            },
            latestRelease {
              ... on Release {
                tagName,
                description
              }
            }
          }
        }
      }
    }
  }
`

export const loader : LoaderFunction = async (params) => {
  const pat = process.env["GITHUB_API_PAT"]
  
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
      <ul>
        <li>bio: {data.user.bio}</li>
        <li>login: {data.user.login}</li>
        <li>url: {data.user.url}</li>
        <li>status:</li>
        <ul>
          <li>emoji: {data.user.status.emoji}</li>
          <li>message: {data.user.status.message}</li>
        </ul>
      </ul>
      <h2>pinned repos:</h2>
      <ul>
        {
          repos.map((repo) => {
            return (
              <li key={repo.name}>
                name: {repo.name} 
                <ul>
                  <li>nameWithOwner: {repo.nameWithOwner}</li>
                  <li>url: {repo.url}</li>
                  <li>description: {repo.description}</li>
                  <li>Stars: {repo.stargazerCount}</li>
                  <li>repositoryTopics:</li>
                  <ul>
                    {
                      repo.repositoryTopics.nodes.map((repoTopic) => {
                        const topic = repoTopic.topic
                        return (
                          <li key={`${repo.name}${topic.name}`}>{topic.name}</li>
                        )
                      })
                    }
                  </ul>
                  <li>languages:</li>
                  <ul>
                    {
                      repo.languages.nodes.map((language) => {
                        return (
                          <li key={`${repo.name}${language.name}`}>{language.name}</li>
                        )
                      })
                    }
                  </ul>
                  <li>latestRelease</li>
                  <ul>
                    <li>{repo.latestRelease.tagName}</li>
                  </ul>
                </ul>
                
              </li>
            )
          })
        }
      </ul>
    </div>
  );
}
