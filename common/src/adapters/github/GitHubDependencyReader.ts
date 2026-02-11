import { DependencyReader } from "../../core/ports/DependencyReader";
import { RepositoryFileReader } from "../../core/ports/RepositoryFileReader";

export class GitHubDependencyReader implements DependencyReader {
    constructor(private repoReader: RepositoryFileReader){}

    async getDependencies(): Promise<Record<string, string>> {
     const raw = await this.repoReader.readFile("package.json");
     let parsed: any;

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Invalid package.json");
    }

     return {
      ...(parsed.dependencies ?? {}),
      ...(parsed.devDependencies ?? {}),
    };

    }
}