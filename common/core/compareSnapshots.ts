import { Dependency, DependencyDiff, DependencySnapshot } from "./types";

export default function compareSnapshots(
    a: DependencySnapshot,
    b: DependencySnapshot
): DependencyDiff {
    let result ={} as DependencyDiff;

    const aDeps = Object.keys(a.dependencies);
    const bDeps = Object.keys(b.dependencies);


    //loop through on dep list and then the other ?
  
    return result;
}

// added -> exists in b, not in a
// removed -> exists in a, not in b
// changed -> exists in both a and b, version is different

