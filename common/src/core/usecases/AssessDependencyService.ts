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

function collectReasons(r: OutdatedDependency): string[] {

    

}

function maxBySeverity() {

}

function determineRisk(r: OutdatedDependency): {
  level: RiskLevel;
  reasons: string[];
} {
  const current = semver.coerce(r.currentVersion);
  const latest = semver.coerce(r.latest);



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
