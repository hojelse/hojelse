import { GitHubProjectType } from "./page";
import style from "./GitHubProjectCard.module.css"
import { GitHubSVG } from "./SVGs";

export function GitHubProjectCard(params: GitHubProjectType) {
  return <div className={style.container} key={params.url}>
    <div className={style.titlebar}>
      <div className="svgwrapper githubsvg">{GitHubSVG}</div>
      <div className={style.title}><a href={params.url}>{params.nameWithOwner}</a></div>
      <div className={style.year}>{params.updatedAt.getFullYear()}</div>
    </div>
    <div className={style.description}>{params.description}</div>
    <div className={style.metabar}>
      <div className={style.lang}>⚪️ {params.primaryLanguage?.name ?? "No language"}</div>
      <div className={style.stars}>⭐️ {params.stargazerCount}</div>
      <div className={style.forks}>🍴 {params.forkCount}</div>
    </div>
  </div>
}
