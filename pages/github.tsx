import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { GraphQLClient, gql } from "graphql-request"
import styled from "styled-components"
import type { PinnedRepositoriesQuery, Repository }  from '../graphql/generated'

const GetPinnedRepositories = gql`
  query PinnedRepositories {
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

type Data = {
  data: PinnedRepositoriesQuery
}

const Home: NextPage<Data> = ({data}) => {
  const user = data.user
  if (user == null) return null
  const repos = user?.pinnedItems.nodes ?? []
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
      <StyledA href={user.url.toString()}>@{user.login}</StyledA>
      <PinnedItemsGrid>
        {
          repos.map((repo) => {
            if (repo == null) return null
            return CreatePinnedItem(repo as Repository)
          })
        }
      </PinnedItemsGrid>
    </Page>
  )
}

function CreatePinnedItem(repo: Repository) {
  const repoNameWithOwner = repo.nameWithOwner
  const repoTopics = repo.repositoryTopics.nodes ?? []
  const repoLanguages = repo.languages?.nodes ?? []
  return (
    <PinnedItem key={repoNameWithOwner}>
      <RepoImage src={repo.openGraphImageUrl.toString()} alt="" />
      <h3>{repo.name}</h3>
      <p><i>{repoNameWithOwner}</i></p>
      <p>{repo.description}</p>
      <ul>
        <li>topics:</li>
        <RepositoryTopics>
          {repoTopics.map((repoTopic) => {
            if (repoTopic == null) return null
            const topic = repoTopic.topic
            return (
              <RepositoryTopicDiv key={`${repoNameWithOwner}${topic.name}`}>
                {topic.name}
              </RepositoryTopicDiv>
            )
          })}
        </RepositoryTopics>
        <li>Stars: {repo.stargazerCount}</li>
        <li>languages:</li>
        <RepositoryTopics>
          {
            repoLanguages.map((language) => {
              if (language == null) return null
              return (
                <RepositoryTopicDiv key={`${repoNameWithOwner}${language.name}`}>
                  {language.name}
                </RepositoryTopicDiv>
              )
            })
          }
        </RepositoryTopics>
      </ul>
      <StyledA href={repo.url.toString()}>Source code</StyledA>
      <StyledA href={repo.homepageUrl.toString()}>Live Demo</StyledA>
    </PinnedItem>
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

export async function getStaticProps() {
  const pat = process.env["GITHUB_API_PAT"]
  
  const githubapi = new GraphQLClient(
    "https://api.github.com/graphql",
    { headers: { Authorization: `bearer ${pat}` } }
  )

  const data = await githubapi.request(GetPinnedRepositories)

  return {
    props: { data },
    revalidate: 60*60
  }
}

export default Home
