import { NpmRegistryAdapter } from "@dep-drift/common";
import { runDependencyAssessment } from "../services/runDependencyAssessment";
import { printRiskReport } from "../output/printRiskReport";
import { Arguments, DependencyReaderFactory } from "../factories/DependencyReaderFactory";


export async function runCheckCommand(args: Arguments) {

  const depReaderFactory = new DependencyReaderFactory();

  const dependencyReader = depReaderFactory.create(args);
  const depRegistry = new NpmRegistryAdapter();

  const results = await runDependencyAssessment(dependencyReader, depRegistry);

  printRiskReport(results);

}

