import { NpmRegistryAdapter, PackageJsonReader } from "@dep-drift/common";
import { DetectOutdatedDependenciesService } from "@dep-drift/common";
import semver from "semver";

type RiskLevel = "high" | "medium" | "low";
const RISK_ORDER: RiskLevel[] = ["high", "medium", "low"];


export async function runCheckCommand(args: string[]) {
  const [packageJsonPath = "package.json"] = args;

  const dependencyReader = new PackageJsonReader(packageJsonPath);
  const depRegistry = new NpmRegistryAdapter();

  const service = new DetectOutdatedDependenciesService(
    dependencyReader,
    depRegistry,
  );

  const results = await service.execute();
  const enriched = results.map((r) => {
    const risk = determineRisk(r);

    return {
      ...r,
      risk
    }
  })

  if (results.length === 0) {
    console.log("✨ All dependencies are up to date");
    return;
  }

  console.log("📦 Dependency Drift Summary:\n");

  const totalChecked = results.length;
  const updatesAvailable = enriched.length;

  const byRisk = {
  high: enriched.filter(r => r.risk.level === "high"),
  medium: enriched.filter(r => r.risk.level === "medium"),
  low: enriched.filter(r => r.risk.level === "low"),
};


console.log(`• ${totalChecked} dependencies checked`);
console.log(`• ${updatesAvailable} updates available`);

if ( updatesAvailable > 0) {
  console.log(` -  ${byRisk.high.length} high risk`);
  console.log(` -  ${byRisk.medium.length} medium risk`);
  console.log(` - ${byRisk.low.length} low risk`  )

}

  /**
   * ROUGH SHAPE:
   * 📦 Dependency Drift Summary:
• 12 dependencies checked
• 5 updates available
  - 3 low risk (patch)
  - 1 medium risk (minor)
  - 1 high risk (major)

  then group by risk

   */

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

function determineRisk(r: {
  currentVersion:string;
  latest: string
}):  { level: RiskLevel; reason: string } {

  const current = semver.coerce(r.currentVersion);
  const latest = semver.coerce(r.latest);

  if (!current || !latest) {
    return { level: "medium", reason: "Unable to determine version risk" };
  }

  if (semver.prerelease(r.latest) ){
    return { level: "high", reason: "Pre-release version"};
  }

  // 0.x versions
  if (current.major === 0 || latest.major === 0) {
    return { level: "medium", reason: "0.x version (API not stable)" };
  }

    const diff = semver.diff(current, latest);

    if (diff === "major") {
      return { level: "high", reason: "Major version update"};
    }

    if (diff === "minor") {
    return { level: "medium", reason: "Minor version update" };
  }

  return { level: "low", reason: "Patch update" };

}
