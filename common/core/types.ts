export type Dependency = {
    name: string;
    version: string;
};

export type DependencySnapshot = {
    sourceId: string;
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