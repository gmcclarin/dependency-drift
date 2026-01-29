import * as semver from "semver";
import { DependencyReader } from "../ports/DependencyReader";
import { VersionRegistry } from "../ports/VersionRegistry";
import { RiskLevel } from "../types/risk";
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

          const coerced = semver.coerce(currentVersion);
          if (!coerced) return undefined;

          if (semver.lt(coerced, latest)) {
            return {
              name,
              currentVersion,
              latest,
            } satisfies OutdatedDependency;
          }

          return undefined;
        }),
      )
    ).filter((r): r is OutdatedDependency => r !== undefined);

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

function determineRisk(r: { currentVersion: string; latest: string }): {
  level: RiskLevel;
  reason: string;
} {
  const current = semver.coerce(r.currentVersion);
  const latest = semver.coerce(r.latest);

  if (!current || !latest) {
    return { level: "medium", reason: "Unable to determine version risk" };
  }

  if (semver.prerelease(r.latest)) {
    return { level: "high", reason: "Pre-release version" };
  }

  // 0.x versions
  if (current.major === 0 || latest.major === 0) {
    return { level: "medium", reason: "0.x version (API not stable)" };
  }

  const diff = semver.diff(current, latest);

  if (diff === "major") {
    return { level: "high", reason: "Major version update" };
  }

  if (diff === "minor") {
    return { level: "medium", reason: "Minor version update" };
  }

  return { level: "low", reason: "Patch update" };
}
