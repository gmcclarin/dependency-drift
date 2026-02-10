import { DependencyReader } from "../../core/ports/DependencyReader";
import { RepositoryFileReader } from "../../core/ports/RepositoryFileReader";

export class GitHubDependencyReader implements DependencyReader {
    constructor(private repoReader: RepositoryFileReader){}

    async getDependencies(): Promise<Record<string, string>> {
     const raw = await this.repoReader.readFile("package.json");
     const parsed = JSON.parse(raw);

     return {
        ...(parsed.dependencies ?? {}),
        ...(parsed.devDependencies ?? {})
    }

    }
}

// this handles parsing errors, if a package.json is missing