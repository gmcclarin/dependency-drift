import { AssessDependencyService, OutdatedDependencyWithRisk } from "@dep-drift/common";
import { DependencyReader } from "@dep-drift/common/dist/core/ports/DependencyReader";
import { VersionRegistry } from "@dep-drift/common/dist/core/ports/VersionRegistry";

export async function runDependencyAssessment(
    reader: DependencyReader,
    registry: VersionRegistry
): Promise<OutdatedDependencyWithRisk[]> {
    const service = new AssessDependencyService(
        reader,
        registry
    );

    return await service.execute();
}