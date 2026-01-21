import { NpmRegistryAdapter, PackageJsonReader } from "@dep-drift/common"
import { DetectOutdatedDependenciesService } from "@dep-drift/common";

export async function runCheckCommand(args: string[]) {
      const [packageJsonPath = "package.json"] = args;

      const dependencyReader = new PackageJsonReader(packageJsonPath);
      const depRegistry = new NpmRegistryAdapter();

      const service = new DetectOutdatedDependenciesService(
        dependencyReader,
        depRegistry
      );

      
}