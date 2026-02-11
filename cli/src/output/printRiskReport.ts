import {
  OutdatedDependencyWithRisk,
  RiskLevel,
} from "@dep-drift/common";

export function printRiskReport(results: OutdatedDependencyWithRisk[]) {
  if (results.length === 0) {
    console.log("✨ All dependencies are up to date");
    return;
  }

  console.log("📦 Dependency Drift Summary:\n");

  const byRisk = {
    high: results.filter(r => r.risk.level === RiskLevel.HIGH),
    medium: results.filter(r => r.risk.level === RiskLevel.MEDIUM),
    low: results.filter(r => r.risk.level === RiskLevel.LOW),
  };

  console.log(`• ${results.length} updates available`);

  console.log(` - ${byRisk.high.length} high risk`);
  console.log(` - ${byRisk.medium.length} medium risk`);
  console.log(` - ${byRisk.low.length} low risk`);

  console.log("\nUpdates available — review recommended\n");

  printRiskSection("High Risk Updates", "🚨", byRisk.high);
  printRiskSection("Medium Risk Updates", "⚠️", byRisk.medium);
  printRiskSection("Low Risk Updates", "🟢", byRisk.low);

  process.exitCode = 1;
}

function printRiskSection(
  title: string,
  emoji: string,
  items: OutdatedDependencyWithRisk[]
) {
  if (items.length === 0) return;

  console.log(`${emoji} ${title}`);
  console.log("─".repeat(title.length + 3));

  for (const r of items) {
    console.log(`
🔧 Update available (${RiskLevel[r.risk.level]} RISK)

${r.name}
Current: ${r.currentVersion}
Latest: ${r.latest}
Reasons: ${r.risk.reasons.join(", ")}
Action: Review before updating
`);
  }
}
