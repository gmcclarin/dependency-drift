import { GitHubDependencyReader, GitHubRepoFileReader, NpmRegistryAdapter } from "@dep-drift/common";
import { runDependencyAssessment } from "../services/runDependencyAssessment";
import { printRiskReport } from "../output/printRiskReport";

export async function runGithubCommand(args: string[]) {
    const [owner, repo, ref, token] = args;

    const repoReader = new GitHubRepoFileReader(
        owner,
        repo,
        ref,
        token
    );
    const dependencyReader = new GitHubDependencyReader(repoReader);
    const depRegistry = new NpmRegistryAdapter();

    const results = await runDependencyAssessment(
        dependencyReader,
        depRegistry
    );

    printRiskReport(results);
}