import { PackageJsonDependencySource } from "../../../common/adapters/packageJson/PackageJsonDependencySource";
import { PackageLockDependencySource } from "../../../common/adapters/packageLock/PackageLockDependencySource";
import { DependencyDiff } from "../../../common/core/types";
import { CompareDependencySourcesService } from "../../../common/core/usecases/CompareDependencySources";

export async function runCompareCommand(args: string[]) {
  const [pathA, pathB] = args;

  if (!pathA || !pathB) {
    throw new Error("Usage: dep-drift compare <sourceA> <sourceB>");
  }

  const sourceA = createSource(pathA);
  const sourceB = createSource(pathB);

  const service = new CompareDependencySourcesService();
  const diff = await service.execute(sourceA, sourceB);

  printDiff(diff);
}

//==================
// HELPERS

function createSource(path: string) {
  if (path.endsWith("package.json")) {
    return new PackageJsonDependencySource(path);
  }

  if (path.endsWith("package-lock.json")) {
    return new PackageLockDependencySource(path);
  }

  throw new Error(`Unsupported dependency source: ${path}`);
}

function printDiff(diff: DependencyDiff) {
  console.log("\nDependency Drift Report\n");

  if (diff.added.length > 0) {
    console.log("Added:");
    diff.added.forEach((d) => {
      console.log(`  + ${d.name}@${d.version}`);
    });
  }

  if (diff.removed.length > 0) {
    console.log("Removed:");
    diff.removed.forEach((d) => {
      console.log(` -${d.name}@${d.version}`);
    });
  }

  if (diff.changed.length > 0) {
    console.log("Changed:");
    diff.changed.forEach((d) => {
      console.log(` ~${d.name}: ${d.from} -> ${d.to}`);
    });
  }

  if (!diff.added.length && !diff.removed.length && diff.changed.length) {
    console.log("No dependency drift detected!!!");
  }
}
