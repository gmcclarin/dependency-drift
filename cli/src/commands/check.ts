import { NpmRegistryAdapter, OutdatedDependencyWithRisk, PackageJsonReader } from "@dep-drift/common";
import { AssessDependencyService } from "@dep-drift/common";

export async function runCheckCommand(args: string[]) {
  const [packageJsonPath = "package.json"] = args;

  const dependencyReader = new PackageJsonReader(packageJsonPath);
  const depRegistry = new NpmRegistryAdapter();

  const service = new AssessDependencyService(
    dependencyReader,
    depRegistry,
  );

  const results = await service.execute();

  if (results.length === 0) {
    console.log("✨ All dependencies are up to date");
    return;
  }

  console.log("📦 Dependency Drift Summary:\n");

  const updatesAvailable = results.length;

  const byRisk = {
  high: results.filter(r => r.risk.level === "high"),
  medium: results.filter(r => r.risk.level === "medium"),
  low: results.filter(r => r.risk.level === "low"),
};


console.log(`• ${updatesAvailable} updates available`);

if ( updatesAvailable > 0) {
  console.log(` -  ${byRisk.high.length} high risk`);
  console.log(` -  ${byRisk.medium.length} medium risk`);
  console.log(` - ${byRisk.low.length} low risk`  )

}
  console.log("\nUpdates available — review recommended\n");

  printRiskSection("High Risk Updates", "🚨", byRisk.high);
  printRiskSection("Medium Risk Updates", "⚠️", byRisk.medium);
  printRiskSection("Low Risk Updates", "🟢", byRisk.low);  

  // future-friendly exit code
  process.exitCode = 1;
}

function printRiskSection(
  title: string,
  emoji: string,
  items: OutdatedDependencyWithRisk[]
) {
  if (items.length === 0) return;

  console.log(`${emoji} ${title}`)
  console.log("─".repeat(title.length + 3));

  for ( const r of items) {
    console.log(`
     🔧 Update available (${r.risk.level.toUpperCase()} RISK)
     
      ${r.name}
      Current: ${r.currentVersion}
      Latest: ${r.latest}
      Risk: ${r.risk.level} - ${r.risk.reason}
      Action: Review before updating
     `);
  }
}
