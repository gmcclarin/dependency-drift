import * as semver from "semver";
import { DependencyReader } from "../ports/DependencyReader";
import { VersionRegistry } from "../ports/VersionRegistry";
import {
  REASON_RULES,
  RISK_BY_REASON,
  RiskAssessment,
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
      const risk = assessRisk(r.currentVersion, r.latest);
      return {
        ...r,
        risk,
      };
    });

    return resultsWithRisk;
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

function assessRisk(currentRaw: string, latestRaw: string): RiskAssessment {
  const current = semver.coerce(currentRaw);
  const latest = semver.parse(latestRaw);

  if (!current || !latest) {
    return { level: RiskLevel.HIGH, reasons: [] };
  }

  const reasons = REASON_RULES.filter((rule) =>
    rule.when({ current, latest }),
  ).map((r) => r.reason);

  const level =
    reasons.length === 0
      ? RiskLevel.LOW
      : Math.max(...reasons.map((r) => RISK_BY_REASON[r].level));

  return {
    level,
    reasons,
  };
}
