import { RepositoryFileReader } from "../../core/ports/RepositoryFileReader";

export class GitHubRepoFileReader implements RepositoryFileReader {
    constructor(
     private owner: string,
     private repo: string,
     private ref: string = "main",
     private token?: string
    ){}

    async readFile(path: string) {
        const res = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.ref}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(this.token && {
            Authorization: `Bearer ${this.token}`,
          }),
        },
      }
    );

    if (!res.ok) {
        throw new Error(`Failed to read from ${path}`);
    }
     const json = await res.json();
    return Buffer.from(json.content, "base64").toString("utf8");

    }
}