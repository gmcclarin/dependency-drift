import { DependencySource } from "../ports/DependencySource";
import { DependencyDiff } from "../types/dependencies";
import compareSnapshots from "../compareSnapshots";


export class CompareDependencySourcesService {
    async execute(
        sourceA: DependencySource,
        sourceB: DependencySource
    ): Promise<DependencyDiff> {

        const snapshotA = await sourceA.getSnapshot();
        const snapshotB = await sourceB.getSnapshot();

        return compareSnapshots(Object.freeze(snapshotA), Object.freeze(snapshotB))
    }
}