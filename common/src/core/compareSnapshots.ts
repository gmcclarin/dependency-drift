import { Dependency, DependencyDiff, DependencySnapshot } from "./types";

export default function compareSnapshots(
    a: DependencySnapshot,
    b: DependencySnapshot
) {

    const aDeps = a.dependencies;
    const bDeps = b.dependencies;

    const allKeys = new Set([...Object.keys(aDeps), ...Object.keys(bDeps)]);

    const result = ([...allKeys].sort()).reduce<DependencyDiff>((acc, key) => {
        // if key is not in a, but IS in b then it was added
        if ( !(key in aDeps) ) {
            acc.added.push({
                name: key,
                version: bDeps[key]
            });
        }

        // if key is not in b, then it was removed
        else if ( !(key in bDeps) ) {
            acc.removed.push({
                name: key,
                version: aDeps[key]
            });
        }

        // not the same between a and b
        else if (aDeps[key] !== bDeps[key]) {
            acc.changed.push({
                name: key,
                from: aDeps[key],
                to: bDeps[key]
            })
        }
        return acc;
    }, {
        added: [],
        removed: [],
        changed: []
    })
  
    return result;
}


