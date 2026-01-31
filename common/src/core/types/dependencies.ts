import { RiskLevel } from "./risk";

export type Dependency = {
    name: string;
    version: string;
};

export type DependencySnapshot = {
    dependencies: Record<string, string>;
};

export type DependencyDiff = {
    added: Dependency[];
    removed: Dependency[];
    changed: {
        name: string;
        from: string;
        to: string;
    }[];
};

export type OutdatedDependency = {
  name: string;
  currentVersion: string;
  latest: string;
};

export type OutdatedDependencyReport = {
  outdated: OutdatedDependency[];
};

export type OutdatedDependencyWithRisk = {
    risk: {
        level: RiskLevel;
        reasons: string[];
    };
    name: string;
    currentVersion: string;
    latest: string;
};





