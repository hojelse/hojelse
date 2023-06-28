"use client"

import { GitHubProjectCard } from "./GitHubProjectCard"
import Image from "next/image"

const GET_STUFF = `query { 
  user(login: "hojelse") {
    avatarUrl,
    bio,
    pinnedItems(first: 10, types: REPOSITORY) {
      nodes {
        ... on Repository {
          url,
          nameWithOwner,
          createdAt,
          updatedAt,
          description,
          stargazerCount,
          forkCount,
          primaryLanguage {
            name
          },
        }
      }
    }
  }
}`

export type GitHubProjectType = {
  url: string,
  nameWithOwner: string,
  updatedAt: Date,
  createdAt: Date,
  description: string
  stargazerCount: number
  forkCount: number
  primaryLanguage: {
    name?: string
  }
}

type DataType = {
  data: {
    user: {
      avatarUrl: string,
      bio: string
      pinnedItems: {
        nodes: GitHubProjectType[]
      }
    }
  }
}

export default async function ApiPage() {
  const data: DataType = await fetch(
    "https://api.github.com/graphql",
    {
      method: "POST",
      body: JSON.stringify({
        "query": GET_STUFF
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "bearer " + process.env.GITHUB_API_PAT
      },
    }
  ).then((res) => res.json());

  const githubProjects = data.data.user.pinnedItems.nodes.map(x => {
    return {
      ...x,
      updatedAt: new Date(x.updatedAt),
      createdAt: new Date(x.createdAt)
    }
  })

  githubProjects.sort((a,b) => a.updatedAt < b.updatedAt ? 1 : -1)

  const imageLoader = () => {
    return data.data.user.avatarUrl
  }

  return <>
    <Image className="pb" loader={imageLoader} src="me.png" alt="me.png" width={100} height={100} />
    <h1>I&apos;m Kristoffer! 👋</h1>
    <p>{data.data.user.bio}</p>
    <h2>Projects</h2>
    <div className="GitHubProjects">
      {
        githubProjects.map(p => {
          return GitHubProjectCard(p)
        })
      }
    </div>
  </>
}
