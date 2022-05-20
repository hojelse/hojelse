import { json, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { GraphQLClient, gql } from "graphql-request"
import styled from "styled-components"

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
  homepageUrl: URL
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
    avatarUrl: URL
    url: URL
    bio: string
    login: string
    status: UserStatus | null
    pinnedItems: {
      nodes: Repository[]
    }
  }
}


const GetPinnedReposQuery = gql`
  {
    user(login: "hojelse") {
      name,
      avatarUrl,
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
            homepageUrl,
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
            languages(first: 2) {
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
  )

  const resp = await githubapi.request(GetPinnedReposQuery)

  return json<GetPinnedReposQueryInterface>(resp)
}

export default function Index() {
  const data = useLoaderData<GetPinnedReposQueryInterface>()
  const user = data.user
  const repos = data.user.pinnedItems.nodes
  console.dir(data)

  return (
    <Page>
      <UserImage src={user.avatarUrl.toString()} alt="" />
      <h1>{user.name}</h1>
      <ul>
        <li>{user.bio}</li>
        <li>login: {user.login}</li>
        <li>url: {user.url}</li>
        {
          (user.status)
          ? (
            <>
              <li>status:</li>
              <ul>
                <li>emoji: {user.status.emoji}</li>
                <li>message: {user.status.message}</li>
              </ul>
            </>
          )
          : null
        }
      </ul>
      <h2>GitHub projects</h2>
      <StyledA href={user.url.toString()}>@hojelse</StyledA>
      <PinnedItemsGrid>
        {
          repos.map((repo) => (
            <PinnedItem key={repo.nameWithOwner}>
              <RepoImage src={repo.openGraphImageUrl.toString()} alt="" />
              <h3>{repo.name}</h3>
              <p><i>{repo.nameWithOwner}</i></p>
              <p>{repo.description}</p>
              <ul>
                <li>topics:</li>
                <RepositoryTopics>
                  {
                    repo.repositoryTopics.nodes.map((repoTopic) => {
                      const topic = repoTopic.topic
                      return (
                        <RepositoryTopicDiv key={`${repo.nameWithOwner}${topic.name}`}>
                          {topic.name}
                        </RepositoryTopicDiv>
                      )
                    })
                  }
                </RepositoryTopics>
                <li>Stars: {repo.stargazerCount}</li>
                <li>languages:</li>
                <RepositoryTopics>
                  {
                    repo.languages.nodes.map((language) => (
                      <RepositoryTopicDiv key={`${repo.nameWithOwner}${language.name}`}>
                        {language.name}
                      </RepositoryTopicDiv>
                    ))
                  }
                </RepositoryTopics>
              </ul>
              <StyledA href={repo.url.toString()}>Source code</StyledA>
              <StyledA href={repo.homepageUrl.toString()}>Live Demo</StyledA>
            </PinnedItem>
          ))
        }
      </PinnedItemsGrid>
    </Page>
  )
}

const UserImage = styled.img`
  height: 150px;
  border-radius: 50%;
`

const RepoImage = styled.img`
  height: 100px;
`

const StyledA = styled.a`
  color: hsl(0, 0%, 100%);
  background-color: hsl(0, 0%, 20%);

  &:link {
    background-color: hsl(0, 100%, 20%);
  }

  &:visited {
    background-color: hsl(100, 100%, 20%);
  }

  &:hover {
    background-color: hsl(150, 100%, 20%);
  }

  &:focus {
    background-color: hsl(200, 100%, 20%);
  }

  &:active {
    background-color: hsl(300, 100%, 20%);
  }
`

const Page = styled.div`
`

const PinnedItemsGrid = styled.div`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 0;
`

const PinnedItem = styled.div`
  background-color: hsl(0, 0%, 95%);
`

const RepositoryTopics = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: row;
  flex-wrap: wrap;
`

const RepositoryTopicDiv = styled.div`
  background-color: hsl(0, 0%, 0%);
  color: hsl(0, 0%, 100%);
  border-radius: 100000px;
  padding: 0 10px;
`