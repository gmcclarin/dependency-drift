import { NpmRegistryAdapter, PackageJsonReader } from "@dep-drift/common";
import { runDependencyAssessment } from "../services/runDependencyAssessment";
import { printRiskReport } from "../output/printRiskReport";


export async function runCheckCommand(args: string[]) {
  const [packageJsonPath = "package.json"] = args;

  const dependencyReader = new PackageJsonReader(packageJsonPath);
  const depRegistry = new NpmRegistryAdapter();

  const results = await runDependencyAssessment(dependencyReader, depRegistry);

  printRiskReport(results);

}

