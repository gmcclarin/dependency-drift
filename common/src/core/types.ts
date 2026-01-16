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
  latestVersion: string;
  wantedRange: string;
};

export type OutdatedDependencyReport = {
  outdated: OutdatedDependency[];
};

