import * as semver from "semver";
import { DependencyReader } from "../ports/DependencyReader";
import { VersionRegistry } from "../ports/VersionRegistry";
import {
  REASON_RULES,
  RISK_BY_REASON,
  RISK_REASON,
  RiskLevel,
} from "../types/risk";
import {
  OutdatedDependency,
  OutdatedDependencyWithRisk,
} from "../types/dependencies";

export class AssessDependencyService {
  constructor(
    private reader: DependencyReader,
    private versionRegistry: VersionRegistry,
  ) {}

  async execute(): Promise<OutdatedDependencyWithRisk[]> {
    const deps = await this.reader.getDependencies();

    const entries = Object.entries(deps);
    const results = (
      await Promise.all(
        entries.map(async ([name, currentVersion]) => {
          const latest = await this.versionRegistry.getLatestVersion(name);
          return assessDependency(name, currentVersion, latest);
        }),
      )
    ).filter((r): r is OutdatedDependency => r !== null);

    const resultsWithRisk = results.map((r) => {
      const risk = determineRisk(r);
      return {
        ...r,
        risk,
      };
    });

    return resultsWithRisk;
  }
}

function collectReasons(
  current: semver.SemVer,
  latest: semver.SemVer,
): RISK_REASON[] {
  return REASON_RULES.filter((rule) => rule.when({ current, latest })).map(
    (r) => r.reason,
  );
}

function maxBySeverity(reasons: RISK_REASON[]): RiskLevel {
  let highestRisk = RiskLevel.LOW;

  reasons.map((r: RISK_REASON) => {
    const riskItemLevel = RISK_BY_REASON[r].level;
    if (riskItemLevel > highestRisk) highestRisk = riskItemLevel;
  });

  return highestRisk;
}

function determineRisk(r: OutdatedDependency): {
  level: RiskLevel;
  reasons: string[];
} {
  const current = semver.coerce(r.currentVersion);
  const latest = semver.coerce(r.latest);

  if (!current || !latest) {
    return { level: RiskLevel.HIGH, reasons: []};
  }

  const reasons = collectReasons(current, latest);
  const highestLevel = maxBySeverity(reasons);

  return {
    level: highestLevel,
    reasons,
    
  }

}

function assessDependency(
  name: string,
  currentVersion: string,
  latest: string,
): OutdatedDependency | null {
  const coerced = semver.coerce(currentVersion);
  if (!coerced) return null;

  if (semver.lt(coerced, latest)) {
    return { name, currentVersion, latest };
  }

  return null;
}
