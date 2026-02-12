import { GitHubDependencyReader, GitHubRepoFileReader, PackageJsonReader } from "@dep-drift/common";

export type Arguments = 
| {
    source: "github"
    owner: string;
    repo: string;
    ref?: string;
    token: string;
}
|{
    source: "local",
    packageJsonPath?: string;
}

export class DependencyReaderFactory {
    create(options: Arguments){

        switch (options.source) {
            case "local":
                return new PackageJsonReader(options.packageJsonPath);
            case "github":
                const repoReader = new GitHubRepoFileReader(
                    options.owner,
                    options.repo,
                    options.ref,
                    options.token
                );
                return new GitHubDependencyReader(repoReader);
            default: 
                throw new Error(`Unsupported source: ${(options as any).source}`)
        }
    }
}