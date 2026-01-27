import { NpmRegistryAdapter, PackageJsonReader } from "@dep-drift/common";
import { DetectOutdatedDependenciesService } from "@dep-drift/common";

export async function runCheckCommand(args: string[]) {
  const [packageJsonPath = "package.json"] = args;

  const dependencyReader = new PackageJsonReader(packageJsonPath);
  const depRegistry = new NpmRegistryAdapter();

  const service = new DetectOutdatedDependenciesService(
    dependencyReader,
    depRegistry,
  );

  const results = await service.execute();

  if (results.length === 0) {
    console.log("✨ All dependencies are up to date");
    return;
  }

  console.log("📦 Dependency Drift Summary:\n");
  console.table(
    results.map((r) => ({
      Package: r.name,
      Current: r.currentVersion,
      Latest: r.latest,

    })),
  );

  // future-friendly exit code
  process.exitCode = 1;
}
